import React from 'react';
import ReactDOM from 'react-dom';
import WordCloud from '../../chart/wordcloud';
import KeywordInContext from 'keyword-in-context';

import '../../chart/wordcloud.css';
import './wordcloud.css';

/**
 * Contains UI for the main configuration options that
 * modify the visualization.
 */
 export default class WordCloudComponent extends React.Component {

   constructor() {
     super();
     this.state = {
       kwikQuery: '',
       kwikText: '',
       selectedNode: ''
     };
   }

   // An event handler for when a word is selected in a word cloud
   selected(token, documentId, node) {
     var text = this.props.kwikData.find((d) => d.id === documentId).text;
     this.setState({
       'kwikQuery': token,
       'kwikText': text,
       'selectedNode': node
     });
   }

  componentDidMount() {
    this.chart = new WordCloud({
      container: ReactDOM.findDOMNode(this).querySelector('.cloud-container')
    });

    this.chart.initialRender();
    this.chart.update(this.props.data, this.props.config);
    this.chart.render();

    // Listen to interaction events from the vis.
    this.chart.on('select', this.selected.bind(this));
  }

  componentDidUpdate() {
    this.chart.update(this.props.data, this.props.config);
    this.chart.render();
  }

  getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    };
  }

  popover(style, content, onclose) {
    return <div style={style}>
      <div className='controls'>
        <button onClick={onclose}>close</button>
      </div>
      <div>
        {content}
      </div>
    </div>;
  }

  renderKeywordInContext() {
    var kwik;
    var kwikPosition;
    if(this.state.selectedNode) {
      let nodeOffset = this.getOffset(this.state.selectedNode);
      kwikPosition = {
        position: 'absolute',
        top: nodeOffset.top + nodeOffset.height + 'px',
        left: nodeOffset.left + 'px',
        zIndex: 100
      };

      kwik = <div>
        <KeywordInContext
          caseSensitive={true}
          contextSize={30}
          text={this.state.kwikText}
          query={this.state.kwikQuery}
        />
      </div>;
    }
    return this.popover(kwikPosition, kwik, () => {
      this.setState({selectedNode: undefined});
    });
  }

  render() {
    return (
      <div>
        <div className='cloud-container'></div>
        {this.renderKeywordInContext()}
      </div>
    );
  }
}

WordCloudComponent.propTypes = {
  // document properties here.
  config: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired,
  kwikData: React.PropTypes.array
};

WordCloudComponent.defaultProps = {
  kwikData: []
};
