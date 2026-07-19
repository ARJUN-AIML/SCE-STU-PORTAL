import time

class StartupProfiler:
    def __init__(self):
        self.phases = []
        self.start_time = time.time()
        self._last_phase_start = self.start_time
        self.total_time = 0

    def mark(self, phase_name: str):
        now = time.time()
        duration = now - self._last_phase_start
        self.add_phase(phase_name, duration)
        self._last_phase_start = now

    def add_phase(self, phase_name: str, duration: float):
        self.phases.append((phase_name, duration))

    def print_report(self):
        self.total_time = time.time() - self.start_time
        print("\n====================================================")
        print("Campus OS Backend Startup")
        print("====================================================")
        print("")
        for name, duration in self.phases:
            duration_ms = duration * 1000
            # Pad the name with dots up to 25 characters
            padded_name = name.ljust(25, '.')
            if duration_ms < 1000:
                print(f"{padded_name}{int(duration_ms)} ms")
            else:
                print(f"{padded_name}{duration_ms:.0f} ms") # example had Embeddings.........1184 ms
        print("")
        print("-----------------------------------------------")
        print(f"TOTAL.....................{self.total_time:.2f} s")
        print("STATUS....................READY")
        print("====================================================\n")
