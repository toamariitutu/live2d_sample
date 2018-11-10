import * as React from 'react';

class Loading extends React.Component<Loading.Props, {}> {
  shouldComponentUpdate(props: Loading.Props): boolean {
    return props.mutable.loading !== this.props.mutable.loading;
  }
  componentDidMount(): void {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes fade {
  0% {
    opacity: 1;
  }

  50% {
    opacity: .2;
  }

  100% {
    opacity: 1;
  }
}`;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  render(): JSX.Element {
    return <div style={{ position: 'absolute', width: '100%', height: '100%', minHeight: '180px', display: this.props.mutable.loading ? 'block' : 'none' }}>
	  <div style={{width: '48px', height: '48px', margin: '0 auto', position: 'relative', bottom: '-60px', zIndex: 99, WebkitAnimationName: 'fade, rotate',
        WebkitAnimationDuration: '.8s', WebkitAnimationTimingFunction: 'linear', WebkitAnimationIterationCount: 'infinite' }}>
	    <span style={this.createSpanStyle(3, 19, '#333')}></span>
	    <span style={this.createSpanStyle(7, 30)}></span>
	    <span style={this.createSpanStyle(19, 35)}></span>
	    <span style={this.createSpanStyle(30, 30)}></span>
	    <span style={this.createSpanStyle(35, 19, '#cacaca')}></span>
	    <span style={this.createSpanStyle(30, 8, '#979797')}></span>
	    <span style={this.createSpanStyle(19, 3, '#676767')}></span>
	    <span style={this.createSpanStyle(7, 8, '#343434')}></span>
	  </div>
	</div>
  }
  
  private createSpanStyle(top: number, left: number, background?: string): any {
    return {
      top: `${top}px`,
      left: `${left}px`,
      background,
      borderRadius: '5px',
      width: '10px',
      height: '10px',
      position: 'absolute'
    }
  }
}

namespace Loading {
  export interface Props {
    mutable: {
      loading: boolean;
    };
  }
}

export default Loading;