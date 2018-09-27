import * as React from 'react';
import State from '../State';
import Observer from '../Observer';
import Live2DCanvas from './Live2DCanvas';
import FaceTracker from './FaceTracker';
import AssetsLoader from './AssetsLoader';
import UserMedia from './UserMedia';
import Controller from './Controller';
import Loading from './Loading';

class Container extends React.Component<{ immutable: State.Immutable; mutable: State.Mutable; }, State.Mutable> {
  private observer: Observer;
  constructor(props: { immutable: State.Immutable; mutable: State.Mutable; }) {
    super(props);
    this.state = props.mutable;
    this.observer = new Observer(this);
  }
  
  render(): JSX.Element {
    const props = {
      mutable: this.state,
      immutable: this.props.immutable,
      observer: this.observer
    };
    return <div>
      <Live2DCanvas {...props} />
      <Controller {...props} />
      <FaceTracker {...props} />
      <AssetsLoader {...props} />
      <UserMedia {...props} />
      <Loading {...props} />
    </div>;
  }
}

export default Container;