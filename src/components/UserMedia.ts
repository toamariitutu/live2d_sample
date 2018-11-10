import * as React from 'react';

class UserMedia extends React.Component<UserMedia.Props, {}> {
  shouldComponentUpdate(props: UserMedia.Props) {
    if (props.mutable.tracking && !this.props.mutable.tracking) {
      if (this.props.mutable.stream) {
          return false;
      }
      navigator.getUserMedia(
        { video: true },
        stream => this.props.observer.onGetUserMedia(stream),
        () => {}
      );
    }
    return false;
  }

  render(): JSX.Element {
    return null;
  }
}

namespace UserMedia {
  export interface Props {
    mutable: {
      tracking: boolean;
      stream?: MediaStream;
    };
    observer: {
      onGetUserMedia(stream: MediaStream): void;
    };
  }
}

export default UserMedia;
