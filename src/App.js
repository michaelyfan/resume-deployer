import React from 'react';
import { FilePicker } from 'react-file-picker';
import './App.css';
import { uploadAll } from './api/api';

function CheckItem(props) {
  const { name, title, selected, changeSelected } = props;
  return (
    <div className='check-item-wrapper' onClick={() => {changeSelected(name);}}>
      <div className={`check-item-circle ${selected ? 'selected' : ''}`}> </div>
      <div className='check-item-description'>
        {title}
      </div>
    </div>
  );
}

class App extends React.Component {
  state = {
    message: '',
    services: {
      linkedin: false,
      handshake: false,
      careerbuzz: false
    }
  }

  resumeInput = null

  handleChangeSelected = (name) => {
    this.setState((prevState) => {
      const services = {
        ...prevState.services,
        [name]: !prevState.services[name]
      };

      return { services };
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.resumeInput == null) {
      this.setState({
        message: 'Please upload a file first!'
      });
      return;
    }

    this.setState({
      message: 'Give us a minute...'
    }, () => {
      const { services } = this.state;
      const resume = this.resumeInput;
      uploadAll(resume, services).then((errors) => {
        if (errors.length <= 0) {
          this.setState({ message: 'Successful on all counts!' });
          return;
        }
        console.log(errors);
        this.setState({ message: 'Errors; oh no! Check the console for details.' });
      });
    });
  }

  handleFile = (f) => {
    this.resumeInput = f;
    this.setState({
      message: `${f.name} uploaded.`
    });
  }

  render() {
    const { message, services } = this.state;
    const { linkedin, handshake, careerbuzz } = services;
    return (
      <div id='app-wrapper'>
        <div id='app-wrapper-sub'>
          <div id='check-items'>
            <div>
              <CheckItem title={'LinkedIn'} name={'linkedin'} changeSelected={this.handleChangeSelected} selected={linkedin} />
              <CheckItem title={'Handshake'} name={'handshake'} changeSelected={this.handleChangeSelected} selected={handshake} />
              <CheckItem title={'CareerBuzz'} name={'careerbuzz'} changeSelected={this.handleChangeSelected} selected={careerbuzz} />
            </div>
          </div>

          <FilePicker
            extensions={['pdf']}
            onChange={this.handleFile}
          >
            <button id='upload-button' className='butn'>
              Upload resume...
            </button>
          </FilePicker>
          <div>
            <button id='upload-button' onClick={this.handleSubmit} className='butn butn-primary'>
              Deploy!
            </button>
          </div>
          <div id='upload-inform-text'>
            {message}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
