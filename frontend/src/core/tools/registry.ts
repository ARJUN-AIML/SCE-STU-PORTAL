export interface AITool {
  id: string;
  name: string;
  description: string;
  category: "Navigation" | "Academic" | "Career" | "Campus" | "General";
  parameters: Record<string, string>; // Describes expected parameters
  permissions: string[]; // required permissions
  availability: boolean; // Is it available right now?
  execute: (args: Record<string, any>) => Promise<any>;
}

class ToolRegistry {
  private tools = new Map<string, AITool>();

  registerTool(tool: AITool) {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool ${tool.id} is already registered. Overwriting.`);
    }
    this.tools.set(tool.id, tool);
  }

  getTool(id: string): AITool | undefined {
    return this.tools.get(id);
  }

  getAllTools(): AITool[] {
    return Array.from(this.tools.values());
  }
  
  getAvailableTools(): AITool[] {
    return this.getAllTools().filter(t => t.availability);
  }

  async executeTool(id: string, args: Record<string, any>) {
    const tool = this.getTool(id);
    if (!tool) {
      throw new Error(`Tool ${id} not found.`);
    }
    if (!tool.availability) {
      throw new Error(`Tool ${id} is currently unavailable.`);
    }
    
    const start = performance.now();
    try {
      const result = await tool.execute(args);
      const duration = performance.now() - start;
      return { success: true, result, duration };
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Observability] Tool '${id}' failed after ${duration.toFixed(2)}ms:`, error);
      return { success: false, error, duration };
    }
  }
}

export const toolRegistry = new ToolRegistry();
