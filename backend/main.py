from asyncio import run

from api import run_api
from database.database import setup


async def main():
    await setup()
    await run_api()

if __name__ == "__main__":
    try:
        run(main=main())
    except KeyboardInterrupt:
        pass
