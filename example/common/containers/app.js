import React                  from 'react';
import Radium, { Style }      from 'radium';
import DocumentMeta           from 'react-document-meta';

import globalStyles           from '../styles/global';

class AppView extends React.Component {
  render() {
    const metaData = {
      title: 'Universal App Example'
    };

    return (
      <div
        id="app-view"
        style={styles.base}>

        <DocumentMeta {...metaData}/>
        <Style rules={globalStyles} />

        {this.props.children}
      </div>
    );
  }

}

const styles = {
  base: {
    width: '100%',
    height: '100%'
  }
}

export default Radium(AppView);
