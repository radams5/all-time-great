import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux'
import './Profile.css'
import {updateQuestion} from '../../redux/reducer';
class Profile extends Component{
  constructor(){
    super()
    this.state = {
      user: {},
      about: '',
      showAbout: true,
      likedQs: [],
      likes: 0
    }
  }

  async componentDidMount(){
    await this.getProfile()
    this.getFollowing()
  }

  getProfile = async () => {
    let res = await axios.get(`/api/profile/${this.props.match.params.uid}`)
    this.setState({
      user: res.data.resp[0],
      likes: res.data.res2[0] ? res.data.res2[0].sum : 0
    })
  }

  getFollowing = async () => {
    let res = await axios.get(`/api/getLiked/${this.props.match.params.uid}`)
    await this.setState({
      likedQs: res.data
    })
  }

  updateAbout = () => {
    let body={about: this.state.about}
    let id = this.props.reduxState.uid
    axios.put(`/api/aboutMe/${id}`, body)
    this.toggleShowAbout()
  }

  toggleShowAbout = () => {
    this.setState({
      showAbout: !this.state.showAbout
    })
  }

  handleAbout = (e) => {
    this.setState({
      about: e.target.value
    })
  }

  checkVotedOrNot = async (question) => {
    let body = { qid: question.qid, uid: this.props.reduxState.uid }
    let canVote = await axios.post('/api/ifVoted', body)
    if (canVote.data === true) {
      let quest = await axios.get(`/api/question/${question.qid}`)
      let res = await axios.get(`/api/getanswersforquestion/${question.qid}`)
      this.props.updateQuestion(question)
      this.props.updateAnsArray(res.data)
      this.setState({
        question: quest.data[0],
        answers: res.data,
      })
      this.props.history.push(`/Vote/${this.props.reduxState.qid}`)
    } else if (canVote.data === false) {
      this.props.updateQuestion(question)
      this.setState({
        question: this.props.question,
        answers: this.props.answers,
        qid: this.props.qid
      })
      this.props.history.push('/Result')
    }
  }


  render(){
    const likedQs = this.state.likedQs.map( question => {
      return(
        <div key={question.qid} className='ProfileLikedQuestions' onClick={ () => this.checkVotedOrNot(question) }>
          <img src={question.q_img} alt="" />
          <p>{question.question}</p>
        </div>

      )
    })
    let username = this.state.user ? this.state.user.username : ''
    let sum = this.state.likes ? this.state.likes : 0
    let avatar = this.state.user ? this.state.user.avatar : ''
    let about = this.state.user ? this.state.user.about : 'About Me'
    const {user} = this.state
    return(
     <div className='Profile'>
        <div className='user-info'>
          <h3 className='user-username'>{username}</h3>
          <h3 className='user-votes'>{sum}</h3>
          <img src={avatar} alt="avatar" className='user-avatar' />
          <p className='user-about'>{about}</p>
          {this.state.showAbout ? <div>
            <button onClick={this.toggleShowAbout} className='about-btn'>About Me</button>
          </div> :
          <div className='my-modal'>
            <button className='close-x' onClick={this.toggleShowAbout}>X</button>
             <input
               value={this.state.about}
               onChange={this.handleAbout}/>
              <button className='update-btn' onClick={this.updateAbout}>Update</button>
          </div>
          }
          {likedQs}
        </div>

      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
    return {
      reduxState
    }
}

export default connect(mapStateToProps, {updateQuestion})(Profile)