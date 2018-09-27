import * as express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import Container from './components/Container';
import State from './State';
import * as glob from 'glob';
import * as path from 'path';

const publicDir = `${__dirname}/../public`,
  models = glob.sync(`${publicDir}/assets/**/*.model.json`).reduce((acc, file) => {
    const { model, physics, textures } = require(file),
        dirname = path.relative(publicDir, path.dirname(file));
    if (!model || !physics || !textures) {
        return acc;
    }
    const name = model.split(/\./)[0];
    acc[name] = {
        name,
        model: path.join(dirname, model),
        physics: path.join(dirname, physics),
        textures: textures.map((texture: string) => path.join(dirname, texture))
    };
    return acc;
    }, {} as {[name: string]: State.Model}),
  app = express(),
  port = process.env.PORT || 9000;

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.send(render(Container, {
    mutable: {
      tracking: false,
      showVideo: false,
      showTrace: false,
      controllerVisible: false,
      loading: false
    },
    immutable: { models }
  }));
});

app.listen(port, () => console.log('listening...' + port));

function render<P>(Component: { new(props: P): React.Component<P, any>; }, props: P): string {
  return `<!DOCTYPE html>${renderToString(
<html>
  <head>
    <meta charSet='UTF-8' />
    <title>nijigenize</title>
    <meta name='viewport' content='width=device-width, initial-scale=0.5, minimum-scale=1.0, maximum-scale=4.0'></meta>
  </head>
  <body style={{margin: 0 }}>
    <div id='reactRoot' data-props={JSON.stringify(props)} dangerouslySetInnerHTML={{__html: renderToString(<Component {...props} />)}} />
    <script src='./lib/live2d.min.js'></script>
    <script src='./lib/Live2DFramework.js'></script>
    <script src='./lib/PlatformManager.js'></script>
    <script src='./lib/clmtrackr.min.js'></script>
    <script src='./lib/model_pca_10_svm.js'></script>
    <script src='./client.js'></script>
  </body>
</html>)}`;
}
