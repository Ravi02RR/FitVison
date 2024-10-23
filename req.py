import aiohttp
import asyncio
import logging
from datetime import datetime
from typing import Optional, List

class LoadTester:
    def __init__(self, base_url: str, max_concurrent: int = 10):
        self.base_url = base_url
        self.max_concurrent = max_concurrent
        self.session: Optional[aiohttp.ClientSession] = None
        self.success_count = 0
        self.error_count = 0
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    async def setup(self):
        self.session = aiohttp.ClientSession()

    async def cleanup(self):
        if self.session:
            await self.session.close()

    async def make_request(self):
        try:
            if not self.session:
                raise RuntimeError("Session not initialized")

            async with self.session.get(self.base_url) as response:
                status = response.status
                self.logger.info(f"Request completed with status: {status}")
                
                if 200 <= status < 300:
                    self.success_count += 1
                else:
                    self.error_count += 1
                    
                return status

        except Exception as e:
            self.error_count += 1
            self.logger.error(f"Request failed: {str(e)}")
            return None

    async def run_test(self, duration_seconds: int = 60):
        await self.setup()
        start_time = datetime.now()
        active_tasks: List[asyncio.Task] = []
        
        self.logger.info(f"Starting load test for {duration_seconds} seconds")
        
        try:
            while (datetime.now() - start_time).seconds < duration_seconds:
                
                active_tasks = [t for t in active_tasks if not t.done()]
                
               
                while len(active_tasks) < self.max_concurrent:
                    task = asyncio.create_task(self.make_request())
                    active_tasks.append(task)
                
                await asyncio.sleep(0.1)  
                
           
            if active_tasks:
                await asyncio.gather(*active_tasks)
                
        finally:
            await self.cleanup()
            
        
        total_requests = self.success_count + self.error_count
        success_rate = (self.success_count / total_requests * 100) if total_requests > 0 else 0
        
        self.logger.info("\nLoad Test Results:")
        self.logger.info(f"Total Requests: {total_requests}")
        self.logger.info(f"Successful Requests: {self.success_count}")
        self.logger.info(f"Failed Requests: {self.error_count}")
        self.logger.info(f"Success Rate: {success_rate:.2f}%")

async def main():
    
    base_url = "http://localhost:3001/"
    test_duration = 30  
    max_concurrent = 10  
    
    tester = LoadTester(base_url, max_concurrent)
    await tester.run_test(test_duration)

if __name__ == "__main__":
    asyncio.run(main())