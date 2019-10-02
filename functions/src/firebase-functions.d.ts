// removing this line breaks things somehow...
import 'firebase-functions/lib/providers/https';

declare module 'firebase-functions/lib/providers/https' {
  type Router = import('express').Router;
  type HttpsFunction = import('firebase-functions').HttpsFunction;
  export function onRequest(handler: Router): HttpsFunction;
}
