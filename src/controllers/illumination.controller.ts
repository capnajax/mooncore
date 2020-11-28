/* eslint-disable @typescript-eslint/ban-ts-ignore */
// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {get, Request, RestBindings} from '@loopback/rest';
import axios from 'axios';
import https from 'https';
import _ from 'lodash';
import YAML from 'yamljs';

enum HttpVerb {
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Link = 'LINK',
  Options = 'OPTIONS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Unlink = 'UNLINK',
}
type PathSpec = {
  verb: HttpVerb;
  path: string | _.TemplateExecutor;
  body: object | string | null | _.TemplateExecutor;
  options: object;
};
type PathDeviceType = {
  [key: string]: PathSpec;
};
type PathList = {
  [key: string]: PathDeviceType;
};
type LightBaseType = {
  name: string;
  type: string;
  address: string;
  key: string | object | null;
};

type HueQueryReturnType = {
  status: number;
  statusText: string;
  config: object;
  request: object;
  data: object;
};

/**
 *	OpenAPI response for mood
 */
const //  ILLUMINATE_RESPONSE: ResponseObject = {
  //     description: 'Illuminate Response',
  //     content: {
  //       'application/json': {
  //         schema: {
  //           type: 'object',
  //           title: 'IlluminateResponse',
  //           properties: {
  //             mood: {type: 'string'},
  //           },
  //         },
  //       },
  //     },
  //   },
  HUE_BASEPATH: String = '<%= address %>/api/<%= key %>/',
  PATHS: PathList = {
    lights: {
      hue: {
        verb: HttpVerb.Get,
        path: _.template(HUE_BASEPATH + 'lights'),
        body: null,
        options: {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      },
    },
    groups: {
      hue: {
        verb: HttpVerb.Get,
        path: _.template(HUE_BASEPATH + 'groups'),
        body: null,
        options: {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      },
    },
    schedules: {
      hue: {
        verb: HttpVerb.Get,
        path: _.template(HUE_BASEPATH + 'schedules'),
        body: null,
        options: {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      },
    },
    scenes: {
      hue: {
        verb: HttpVerb.Get,
        path: _.template(HUE_BASEPATH + 'scenes'),
        body: null,
        options: {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      },
    },
    off: {
      hue: {
        verb: HttpVerb.Get,
        path: _.template(HUE_BASEPATH + 'lights/<%= lightId %>/state'),
        body: '{"on":false}',
        options: {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      },
    },
    on: {
      hue: {
        verb: HttpVerb.Get,
        path: _.template(HUE_BASEPATH + 'lights/<%= lightId %>/state'),
        body: '{"on":true}',
        options: {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      },
    },
  },
  secrets = YAML.load(__dirname + '/secrets.yaml');

function getData(type: string, options?: object): Promise<object>[] {
  const promises: Promise<object>[] = [];

  secrets.lights.bases.forEach((base: LightBaseType) => {
    const path = PATHS[type][base.type],
      requestSpec = _.extend({}, path.options, {
        method: path.verb,
        url: path.path,
        data: path.body,
      }),
      templateParams = () => {
        return templateP ?? (templateP = _.defaults({}, base, options));
      };
    let templateP: object | null;

    // console.log('templateParams', templateParams());
    // console.log('templateParams', templateParams());

    ['url', 'body'].forEach((p: string) => {
      // @ts-ignore
      if (_.isFunction(requestSpec[p])) {
        // @ts-ignore
        requestSpec[p] = requestSpec[p](templateParams());
      }
    });

    console.log('requestSpec', requestSpec);

    promises.push(axios(requestSpec));
  });

  return axios.all(promises);
}

const apis = ['lights', 'groups', 'schedules', 'scenes'];

const promises: Promise<object>[] = [];

//apis.forEach(api => promises.push(getData(api)));

Promise.all(promises)
  .then(calls => {
    calls.forEach((t: object, i: number) => {
      console.log();
      console.log(`**** ${apis[i]}: `);
      // @ts-ignore
      t.forEach((response: object) => {
        // @ts-ignore
        console.log(response.data);
      });
    });
  })
  .catch(reason => {
    console.error({reason});
  });

export class IlluminationController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // map to `GET illuminate`
  @get('/illuminate')
  async getIllumination(): Promise<object> {
    // reply with the new illumination status
    const lightsData = await getData('lights');
    console.log(lightsData);
    return lightsData;
  }
  // map to `PUT illuminate`
  // @put('/illuminate')
  // putIllumination(): object {
  //   // reply with the new illumination status
  //   return getData;
  // }
}
