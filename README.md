# Cloudflare Turnstile React Library

This library provides a React component that can be used to protect your site from bots and scrapers using Cloudflare Turnstile.

Basic usage can be found at the [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/).

## Installation

```bash
npm i react-cf-turnstile
```
```bash
yarn add react-cf-turnstile
```

## Methods
Methods can be called using a reference. Passing the widget ID is not necessary.

| Name            | Description                                                               |
|-----------------|---------------------------------------------------------------------------|
| renderTurnstile | Calls the turnstile.render() function                                     |
| resetTurnstile  | Can be used to reset the widget if it has expired or needs to be reloaded |
| removeTurnstile | Removes the widget                                                        |
| getResponse     | soon™                                                                     |


## Props

| Name             | Type     | Required | Description                                                                             | 
|------------------|----------|----------|-----------------------------------------------------------------------------------------|
| sitekey          | string   | yes      | The sitekey associated with your widget configuration on the Cloudflare Dashboard       |
| action           | string   |          | Information used in analytics to differentiate between widgets on the same site         |
| cData            | string   |          | Payload used to attach customer data to the challenge which is returned upon validation |
| callback         | callback | yes      | Called when a challenge is successfully completed                                       |
| expired-callback | callback |          | Called when a challenge expires                                                         |
| error-callback   | callback |          | Called when there is a network error                                                    |
| theme            | string   |          | Theme of the widget. Can be light, dark or auto                                         |
| tabindex         | number   |          | Tabindex of the iframe for accessibility purposes                                       |



## Example
In this example, I use the demo only sitekey provided by Cloudflare. You should use your own sitekey in production.

```tsx
import React from 'react';
import CFTurnstile from 'react-cf-turnstile';

function App() {
  return (
    <CFTurnstile
      sitekey="1x00000000000000000000AA" // change me! testing only
      action="FORM_SUBMIT" // optional: used in analytics to differentiate between different turnstiles on the same site
      cData="some data" // optional: read cloudflare docs for more info
      callback={(token) => { // called when challenge is completed successfully
        console.log(token);
      }}
      expired-callback={() => { // optional: called when a challenge expires
        console.log('expired');
      }}
      error-callback={(error) => { // optional: called when an error occurs
          console.error(error);
      }}
      theme="light" // optional: light/dark/auto
      tabindex="0" // optional: tabindex for the iframe for accessibility
    />
  );
}
```

## Feeling experimental? Grab the latest dev build

Note: dev builds are not guaranteed to be stable and may contain breaking changes not clearly documented

```bash
npm i react-cf-turnstile@dev
```
```bash
yarn add react-cf-turnstile@dev
```
