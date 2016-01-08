# Office Add-in Server Authentication Sample for NodeJS

A goal of many Microsoft Office Add-ins is to improve user productivity. You can get closer to achieving this goal with the help of third-party services. Most of today's services implement the OAuth 2.0 specification to allow other applications into the user data.

![Office Add-in Server Authentication Sample screenshot](/readme-images/Office-Add-in-NodeJS-ServerAuth.png)

Keep in mind that Office Add-ins run on a variety of platforms and devices, which presents a great opportunity for your add-in. You must be aware, however, of the following considerations when you try to make OAuth flows work across a combination of platforms and technologies.

## Design considerations

Office applications display add-ins within an iframe on browser platforms. Many authentication services refuse to present sign-in pages to an iframe to minimize the risk that a malicious page could interfere. This limits displaying any sign-in page in the main add-in window.

**Solution:** Start the OAuth flow from a pop-up window

After the OAuth flow is done, you might want to pass the tokens to your main add-in page and use them to make API calls to the 3rd party service. 
Some browsers, most notably Internet Explorer, navigate within security boundaries (e.g. Zones). If pages are in different security zones, it’s not possible to pass tokens from the pop-up page to the main page.

**Solution:** Store the tokens in a database and make the API calls from your server instead. Enable server-side communication via sockets to send authentication results to the main page. There are many libraries that make it easy to communicate between the server and the browser. This sample uses [Socket.io](http://socket.io) to notify the main add-in page that the OAuth flow is done.

Because of the security zones mentioned previously, we can't ensure that the pop-up and the main add-in page share the same session identifier in your add-in. If this is the case, the add-in server doesn't have a way to determine what main add-in page it needs to notify.

**Solution:** Use the main page session ID to identify the browser session. If you have to open a pop-up, send the session identifier as part of the path or query string.

Your add-in must reliably identify the browser session that started the OAuth flow. When the flow returns to the configured redirect URI, your add-in needs to decide which browser session owns the tokens. If your add-in pages are in different security zones, the add-in won't be able to assign the tokens to the right browser session.

**Solution:** Use the state parameter in the OAuth flow to identify the session that owns the tokens. Further discussion about this technique can be found in [Encoding claims in the OAuth 2 state parameter using a JWT](https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-04). Note that the article is a work in progress. 

As an additional security measure, this sample deletes tokens from the database within two minutes of requesting them. You should implement token storage policies according to your application requirements.

## Prerequisites

To use the Office Add-in Server Authentication sample, you need the following:

* [Node.js](https://nodejs.org/) is required to run the sample. The sample has been tested on Node.js version 4.2.1.
* [CouchDB](https://couchdb.apache.org) version 1.5.1 or greater.
* Some dependencies require Python version 2.7.
* Some dependencies require XCode version 6.3 or greater (Mac) or Visual Studio Express 2015 with [Common Tools for Visual C++ 2015](/readme-images/VSC++CommonTools.png) (Windows).
* The sample requires a Bash shell, in Windows you can use Git for Windows or Cygwin. Mac and Linux developers can use their standard terminals.
    * The sample requires OpenSSL to generate a self-signed certificate. The mentioned Bash shells as well as most Mac and Linux Bash shells include a compatible version of OpenSSL.
* A ```client ID``` and ```secret``` values of an application registered in Azure and/or Google.

## Register your app in Azure or Google

The ServerAuth sample supports apps registered in Azure or Google. You can test the sample with either services or both.

### Register your app in Azure

Register a web application in [Azure Management portal](https://manage.windowsazure.com) with the following configuration:

Parameter | Value
---------|--------
Name | ServerAuth sample (optional)
Type | Web application and/or web API
Sign-on URL | https://localhost:3000/connect/azure/callback
App ID URI | https://localhost:3000 (optional)

Once you register your application, take note of the *client ID* and *client secret* values.

Note that the default permissions are enough for this sample. For more information on how to register your app, see [Register your web server app with the Azure Management Portal](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterServerApp).

### Register your app in Google

Register a web application in [Google Developers Console](https://console.developers.google.com) with the following configuration:

Parameter | Value
---------|--------
Project name | ServerAuth sample (optional)
Credentials | OAuth client ID
Application type | Web application
Authorized redirect URIs | https://localhost:3000/connect/google/callback

Once you register your application, take note of the *client ID* and *client secret* values.

Note that the default permissions are enough for this sample. For more information on how to register your app, see [Developers Console Help](https://developers.google.com/console/help/new/).

## Configure and run the web app

1. Use a text editor to open ```ws-conf.js```.
2. Replace *ENTER_YOUR_CLIENT_ID* with the client ID of your registered Azure or Google application.
3. Replace *ENTER_YOUR_SECRET* with the client secret of your registered Azure or Google application.
4. Generate a self-signed certificate using the included script: [`ss_certgen.sh`](/ss_certgen.sh).

    To run the script, run the following command in your terminal:
    
    On Linux/Mac
    ```
    $ bash ss_certgen.sh
    ```
    On Git Bash for Windows
    ```
    $ winpty bash ss_certgen.sh
    ```
    On Cygwin for Windows
    ```
    > bash -o igncr ss_certgen.sh
    ```

   The script guides you through the steps to generate a self-signed server certificate. Make sure to type *localhost* in the **Common Name** step.
   
   After running the script, two files will be created in the project root:
   ```
   server.crt // the certificate
   ```
   
   ```
   server.key // the keyfile
   ```
   
   > **Note:** <br />
   `server.crt` and `server.key` must be present in the project root - they will be picked up automatically at runtime. To use an alternate path see [`certconf.js`](/certconf.js).

5. Install the dependencies running the following command:

    On Linux/Mac
    ```
    npm install
    ```
    On Windows
    ```
    npm install --msvs_version=2015
    ```

6. Make sure that your CouchDB server is running.    
7. Start the application with the following command:
    ```
    npm start
    ```
    
    > **Note:** <br />
    You must trust the self-signed certificate so it can display properly in Office. See, [Trust your self-signed certificate](https://github.com/OfficeDev/Office-Add-in-NodeJS-ServerAuth/wiki/Trust-your-self-signed-certificate) for instructions.
    
8. Open Microsoft Word or Microsft Excel and click **Insert** > **My add-ins** > **See all**
9. Click **Shared Folder** if you deployed the add-in to a network share, or click **My Organization** if you deployed the add-in to the add-in catalog.
10. Click **ServerAuth Sample**.

## Credits

This code sample is based on ideas originally published in a [blog post](http://blogs.msdn.com/b/richard_dizeregas_blog/archive/2015/08/10/connecting-to-office-365-from-an-office-add-in.aspx) by Richard diZerega. Richard is an evangelist at Microsoft who works with Office 365 developers.

## Questions and comments

We'd love to get your feedback about this sample. You can send your questions and suggestions to us in the [Issues](https://github.com/OfficeDev/Office-Add-in-NodeJS-ServerAuth/issues) section of this repository.

Questions about Office 365 development in general should be posted to [Stack Overflow](http://stackoverflow.com/questions/tagged/office-addins). Make sure that your questions or comments are tagged with [office-addins].
  
## Additional resources

* [More Add-in samples](https://github.com/OfficeDev?utf8=%E2%9C%93&query=-Add-in)
* [Office Add-ins](http://msdn.microsoft.com/library/office/jj220060.aspx)
* [Anatomy of an Add-in](https://msdn.microsoft.com/library/office/jj220082.aspx#StartBuildingApps_AnatomyofApp)

## Copyright
Copyright (c) 2015 Microsoft Corporation. All rights reserved.
