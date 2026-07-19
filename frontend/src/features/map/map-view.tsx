import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { 
  Search, MapPin, Navigation2, Building, X, CheckCircle, Crosshair, Copy, ChevronLeft, ChevronRight, Zap, Target, ParkingCircle, Home, Bus, RouteOff
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { physicalLocations, LocationCategory, campusBuildings } from "./map-data"
import { resolveDestination, ResolvedDestination } from "./map-resolver"
import { campusRouter, Point } from "./map-graph"
import { commandDispatcher } from "@/core/commands/dispatcher"

const getCategoryIcon = (category: LocationCategory) => {
   switch (category) {
      case "Academic": return <Building className="h-[14px] w-[14px]" />
      case "Sports": return <Target className="h-[14px] w-[14px]" />
      case "Utility": return <Zap className="h-[14px] w-[14px]" />
      case "Hostel": return <Home className="h-[14px] w-[14px]" />
      case "Transport": return <Bus className="h-[14px] w-[14px]" />
      case "Parking": return <ParkingCircle className="h-[14px] w-[14px]" />
      default: return <MapPin className="h-[14px] w-[14px]" />
   }
}

function MapContent({ 
   resolvedTarget, 
   setResolvedTarget, 
   setSearchQuery, 
   calibrationMode,
   calibratedLocations,
   activeLocationKey,
   handleMapClick,
   scale,
   zoomToElement,
   isRouting,
   setIsRouting
}: any) {
  
  const youAreHere = calibratedLocations["Main Gate"]?.coordinates || { x: 0.52, y: 0.95 }
  const [showYouAreHereLabel, setShowYouAreHereLabel] = useState(true)

  useEffect(() => {
     const t = setTimeout(() => setShowYouAreHereLabel(false), 3000)
     return () => clearTimeout(t)
  }, [])
  
  const routePoints = useMemo<Point[]>(() => {
     if (resolvedTarget?.physicalBlock && !calibrationMode && isRouting) {
         return campusRouter.findShortestPath("Main Gate", resolvedTarget.physicalBlock);
     }
     return [];
  }, [resolvedTarget, calibrationMode, isRouting]);

  useEffect(() => {
     if (resolvedTarget?.physicalBlock && zoomToElement) {
         const elId = `marker-${resolvedTarget.physicalBlock.replace(/\s+/g, '-')}`
         const el = document.getElementById(elId)
         if (el) {
            const targetScale = scale >= 1.5 ? scale : 2.5
            zoomToElement(el, targetScale, 600, "easeOut")
         }
     }
  }, [resolvedTarget, zoomToElement])

  const routePathD = routePoints.length > 0 
      ? `M ${routePoints[0].x},${routePoints[0].y} ` + routePoints.slice(1).map(p => `L ${p.x},${p.y}`).join(" ")
      : "";

  return (
    // Crucial fix: inline-block shrink-wraps perfectly to the img width/height
    <div className="relative inline-block leading-none shadow-2xl rounded-lg">
       <img 
         src="/campus-map.jpeg" 
         alt="Campus Master Plan" 
         className={`block w-auto h-auto rounded-lg ${calibrationMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
         style={{ maxHeight: "calc(100vh - 160px)", opacity: 0.95 }}
         onClick={handleMapClick}
         draggable={false}
       />
       
       <AnimatePresence>
         {isRouting && routePoints.length > 0 && (
            <motion.svg 
               key="route-layer"
               viewBox="0 0 1 1" 
               preserveAspectRatio="none" 
               className="absolute inset-0 w-full h-full pointer-events-none z-10"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
               <motion.path 
                  id="route-path"
                  d={routePathD}
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ opacity: 0.4 }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
               />
               <motion.path 
                  d={routePathD}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
               />
            </motion.svg>
         )}
       </AnimatePresence>
       
       <div className="absolute flex flex-col items-center justify-center z-30 pointer-events-none"
            style={{ 
               left: `${youAreHere.x * 100}%`, 
               top: `${youAreHere.y * 100}%`, 
               transform: `translate(-50%, -50%)`
            }}>
          <div style={{ transform: `scale(${1 / scale})` }} className="relative flex flex-col items-center group">
            <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping" style={{ width: '36px', height: '36px', left: '-10px', top: '-10px' }} />
            <div className="h-4 w-4 bg-blue-600 rounded-full border-[2.5px] border-white shadow-[0_0_8px_rgba(37,99,235,0.6)] relative z-20" />
            
            <AnimatePresence>
               {showYouAreHereLabel && (
                  <motion.span 
                     initial={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.5 }}
                     className="absolute top-5 text-[9px] font-bold bg-white/95 text-blue-700 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap border border-blue-100"
                  >
                     You are here
                  </motion.span>
               )}
            </AnimatePresence>
          </div>
       </div>

       {Object.values(calibratedLocations).map((loc: any) => {
          const isSelected = calibrationMode ? (loc.name === activeLocationKey) : (resolvedTarget?.physicalBlock === loc.name)
          
          const Icon = getCategoryIcon(loc.category)
          const elId = `marker-${loc.name.replace(/\s+/g, '-')}`
          
          return (
            <AnimatePresence key={loc.name}>
               <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  id={elId}
                  onClick={(e) => {
                     if (!calibrationMode) {
                        e.stopPropagation()
                        setResolvedTarget({ physicalBlock: loc.name, requestedDestination: loc.name })
                        setSearchQuery(loc.name)
                        setIsRouting(false)
                     }
                  }}
                  className={`absolute flex flex-col items-center justify-center z-20 ${calibrationMode ? 'pointer-events-none' : 'cursor-pointer'} group ${isSelected ? 'z-40' : 'opacity-95 hover:opacity-100'}`}
                  style={{ 
                     left: `${loc.coordinates.x * 100}%`, 
                     top: `${loc.coordinates.y * 100}%`,
                     transform: `translate(-50%, -50%)`
                  }}
               >
                  <div style={{ transform: `scale(${1 / scale})` }} className="flex flex-col items-center relative">
                     
                     {!isSelected && !calibrationMode && (
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/90 text-white text-[10px] font-medium px-2.5 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
                        {loc.name}
                        </div>
                     )}

                     <motion.div 
                       animate={isSelected && !calibrationMode ? { scale: 1.15 } : { scale: 1 }}
                       className={`
                         w-[28px] h-[28px] rounded-full shadow-sm border transition-colors flex items-center justify-center
                         ${isSelected ? 'bg-primary border-primary text-white shadow-primary/30' : 
                           'bg-surface border-border text-text hover:border-primary'}
                       `}
                     >
                        {calibrationMode && isSelected ? <Crosshair className="h-[14px] w-[14px]" /> : Icon}
                     </motion.div>
                     
                     {calibrationMode && isSelected && (
                        <span className="absolute -bottom-5 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap bg-primary text-white z-40">
                        {loc.name}
                        </span>
                     )}
                  </div>
               </motion.div>
            </AnimatePresence>
          )
       })}
    </div>
  )
}

export function MapView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [resolvedTarget, setResolvedTarget] = useState<ResolvedDestination | null>(null)
  const [isRouting, setIsRouting] = useState(false)
  
  const [calibrationMode, setCalibrationMode] = useState(false)
  const [calibratedLocations, setCalibratedLocations] = useState(physicalLocations)
  const [activeCalibIndex, setActiveCalibIndex] = useState(0)

  const locationKeys = Object.keys(calibratedLocations)
  const activeLocationKey = locationKeys[activeCalibIndex]

  useEffect(() => {
    const handleMapCommand = (query: string) => {
      setSearchQuery(query)
      const res = resolveDestination(query)
      if (res.physicalBlock) {
        setResolvedTarget(res)
        setIsRouting(true) // AI auto-routes
      }
    }
    commandDispatcher.register('openMapLocation', handleMapCommand)
    return () => {
       commandDispatcher.unregister('openMapLocation')
    }
  }, [])

  const handleMapClick = (e: React.MouseEvent<HTMLImageElement>) => {
     if (!calibrationMode || !activeLocationKey) return
     const rect = e.currentTarget.getBoundingClientRect()
     const x = (e.clientX - rect.left) / rect.width
     const y = (e.clientY - rect.top) / rect.height
     
     setCalibratedLocations(prev => ({
        ...prev,
        [activeLocationKey]: {
           ...prev[activeLocationKey],
           coordinates: { x, y }
        }
     }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim().length > 2) {
       const res = resolveDestination(e.target.value)
       if (res.physicalBlock) {
         setResolvedTarget(res)
         setIsRouting(false)
       }
    } else {
       setResolvedTarget(null)
       setIsRouting(false)
    }
  }

  const activePhysicalLocation = resolvedTarget?.physicalBlock ? calibratedLocations[resolvedTarget.physicalBlock] : null;
  const blockContents = activePhysicalLocation ? campusBuildings[activePhysicalLocation.name] : null;

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)] relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 px-1">
        <div>
          <h1 className="text-3xl font-display font-semibold text-text">Campus Navigator</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search departments, labs, rooms..." 
              className="pl-9 bg-surface border-border h-10 rounded-xl shadow-sm focus-visible:ring-primary/20" 
            />
            {searchQuery && (
               <button onClick={() => { setSearchQuery(""); setResolvedTarget(null); setIsRouting(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-2 rounded-md transition-colors">
                 <X className="h-4 w-4 text-muted" />
               </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          <Card className="flex-1 overflow-hidden relative border-border bg-zinc-950 rounded-2xl shadow-sm flex items-center justify-center p-0 m-0">
            
            <TransformWrapper
               initialScale={1}
               minScale={0.5}
               maxScale={5}
               centerOnInit={true}
               limitToBounds={true}
               wheel={{ step: 0.1 }}
               pinch={{ step: 5 }}
            >
               {({ zoomIn, zoomOut, resetTransform, zoomToElement, state }) => (
                 <>
                   <TransformComponent 
                     wrapperStyle={{ width: "100%", height: "100%" }} 
                     contentStyle={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                   >
                      <MapContent 
                        resolvedTarget={resolvedTarget}
                        setResolvedTarget={setResolvedTarget}
                        setSearchQuery={setSearchQuery}
                        calibrationMode={calibrationMode}
                        calibratedLocations={calibratedLocations}
                        activeLocationKey={activeLocationKey}
                        handleMapClick={handleMapClick}
                        scale={state.scale}
                        zoomToElement={zoomToElement}
                        isRouting={isRouting}
                        setIsRouting={setIsRouting}
                      />
                   </TransformComponent>
                   
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
                     <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl shadow-lg border border-border bg-surface/95 backdrop-blur text-text hover:bg-surface-2" onClick={() => zoomIn()}>
                       <span className="text-lg leading-none">+</span>
                     </Button>
                     <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl shadow-lg border border-border bg-surface/95 backdrop-blur text-text hover:bg-surface-2" onClick={() => zoomOut()}>
                       <span className="text-lg leading-none">-</span>
                     </Button>
                     <div className="h-px bg-border my-1 mx-2" />
                     <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl shadow-lg border border-border bg-surface/95 backdrop-blur text-text hover:bg-surface-2" onClick={() => resetTransform()}>
                       <Crosshair className="h-4 w-4" />
                     </Button>
                   </div>
                 </>
               )}
            </TransformWrapper>
          </Card>

        {activePhysicalLocation && (
          <div className="w-full lg:w-[320px] flex flex-col shrink-0 h-full">
            <Card className="flex-1 border-border overflow-y-auto flex flex-col bg-surface shadow-sm rounded-2xl p-5">
              <AnimatePresence mode="wait">
                <motion.div 
                   key="info"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                     <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                           {activePhysicalLocation.category}
                        </span>
                        <h3 className="font-display font-semibold text-xl leading-tight text-text">
                           {activePhysicalLocation.name}
                        </h3>
                     </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted hover:text-text hover:bg-surface-2" onClick={() => { setResolvedTarget(null); setIsRouting(false); }}>
                        <X className="h-4 w-4" />
                     </Button>
                  </div>

                  {blockContents ? (
                     <div className="space-y-5 mb-8 flex-1">
                        {blockContents.departments && blockContents.departments.length > 0 && (
                           <div>
                              <h4 className="text-xs font-semibold text-muted uppercase mb-2">Departments</h4>
                              <ul className="space-y-1.5">
                                 {blockContents.departments.map((dept, i) => (
                                    <li key={i} className="text-sm text-text flex items-center gap-2">
                                       <div className="h-1.5 w-1.5 rounded-full bg-primary/40" /> {dept}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}
                        {blockContents.facilities && blockContents.facilities.length > 0 && (
                           <div>
                              <h4 className="text-xs font-semibold text-muted uppercase mb-2">Facilities</h4>
                              <ul className="space-y-1.5">
                                 {blockContents.facilities.map((fac, i) => (
                                    <li key={i} className="text-sm text-text flex items-center gap-2">
                                       <div className="h-1.5 w-1.5 rounded-full bg-border" /> {fac}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="mb-8 flex-1">
                        <p className="text-sm text-muted leading-relaxed">
                           {activePhysicalLocation.description}
                        </p>
                     </div>
                  )}

                  <div className="mt-auto space-y-3 shrink-0">
                    {!isRouting ? (
                        <Button 
                           onClick={() => setIsRouting(true)}
                           className="w-full font-medium h-11 rounded-xl shadow-sm bg-primary hover:bg-primary/90 text-white"
                        >
                           <Navigation2 className="h-4 w-4 mr-2" /> 
                           Navigate Here
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-3">
                           <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                              <div className="flex items-center gap-2 text-sm">
                                 <CheckCircle className="h-4 w-4 text-primary" />
                                 <span className="font-medium text-text">Route Active</span>
                              </div>
                           </div>
                           <Button variant="outline" className="w-full h-11 rounded-xl text-muted hover:text-text border-border hover:bg-surface-2" onClick={() => setIsRouting(false)}>
                              <RouteOff className="h-4 w-4 mr-2" />
                              Clear Route
                           </Button>
                        </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
