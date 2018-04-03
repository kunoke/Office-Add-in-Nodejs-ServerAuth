/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

exports.azureConf = {
  clientID: 'ENTER_YOUR_CLIENT_ID',
  clientSecret: 'ENTER_YOUR_SECRET',
  resource: 'https://graph.microsoft.com',
  callbackURL: 'https://localhost:3000/connect/azure/callback',
  passReqToCallback: true
};

exports.googleConf = {
  clientID: '1008575147866-dlh4nf23clgiqvapji1ucssntat508kn.apps.googleusercontent.com',
  clientSecret: 'IRbjIwxeQ9zo8jDoNaM9E7XD',
  callbackURL: 'https://localhost:3000/connect/google/callback',
  passReqToCallback: true
};
