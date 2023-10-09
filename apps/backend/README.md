# Haishin Backend

Built with Elysia + Bun, for super good websockets and handling the restreaming + transcoding + transcribing + translating of livestreams via worker threads.

Should accept a livestream url from a user, subscribe to it's websocket room and if it's the first user, set up the restream + transcode + transcribe + translate pipeline else just add the user to the room to get the latest transcriptions + translations.
