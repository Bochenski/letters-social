import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Filter from 'bad-words';

const filter = new Filter();

class CreatePost extends Component {
  static propTypes = {}
  constructor(props) {
    super(props);

    //set up state
    this.state = {
      content: '',
      valid: false
    };

    //set up handlers
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
    this.handlePostChange = this
      .handlePostChange
      .bind(this);
  }

  handlePostChange(event) {
    const content = filter.clean(event.target.value);
    this.setState(() => {
      return {
        content,
        valid: content.length <= 280
      };
    });
  }

  handleSubmit() {
    if (!this.state.valid) {
      return;
    }
    const newPost = {
      content: this.state.content
    };

    console.log(this.state);
  }

  render() {
    return (
      <div classname="create-post">
        <button onClick={this.handleSubmit}>Post</button>
        <textarea
          onChange={this.handlePostChange}
          placeholder="What's on your mind?"
          value={this.state.content}/>
      </div>
    );
  }
}
////
export default CreatePost;
