// Uncomment these imports to begin using these cool features!

import {Request, RestBindings, get, put, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';

/**
 *	OpenAPI response for mood
 */
const ILLUMINATE_RESPONSE: ResponseObject = {
	description: 'Illuminate Response',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				title: 'IlluminateResponse',
				properties: {
					mood: {type: 'string'}
				}
			}
		}
	}
}


export class IlluminationController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

	// map to `GET illuminate`
	@get('/illuminate', {
		responses: {
			'200': ILLUMINATE_RESPONSE,
		},
	})
	getIllumination() : object {
		// reply with the new illumination status
		return {

		};
	}
	// map to `PUT illuminate`
	@put('/illuminate', {
		responses: {
			'200': ILLUMINATE_RESPONSE,
		},
	})
	putIllumination() : object {
		// reply with the new illumination status
		return {

		};
	}
}
