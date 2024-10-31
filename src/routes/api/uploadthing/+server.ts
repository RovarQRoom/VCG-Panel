import { createRouteHandler } from 'uploadthing/server';
import { ourFileRouter } from '$lib/Uploadthing/Uploadthing';

export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
	config: {
		uploadthingId: 'YOUR_UPLOADTHING_APP_ID',
		uploadthingSecret: 'YOUR_UPLOADTHING_SECRET'
	}
});
