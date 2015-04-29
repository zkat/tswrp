import React from "react";

export default React.createClass({
  displayName: "KumuEmbed",
  getDefaultProps() {
    return {
      selection: "",
      focusDistance: ""
    };
  },
  render() {
    let url = `http://kumu.io/embed/${this.props.embedId}#${this.props.mapName}/${this.props.selection}?focus=${this.props.focusDistance}`
    return <iframe {...this.props} src={url}></iframe>;
  }
});
