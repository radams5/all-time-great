import React, { Component } from 'react'
import './Vote.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Modal from 'react-responsive-modal'
import { connect } from 'react-redux'
import { updateQuestion, updateAnsArray } from '../../redux/reducer'

class Vote extends Component {
  constructor() {
    super()
    this.state = {

      question: {},
      img: '',
      answers: [],
      anwser: '',
      aid: 0,
      qid: 0,
      modalImage: '',
      open: false
    }
  }
  componentDidMount = () => {
    this.getQuestionAndAnswers()
  }
  getQuestionAndAnswers = async () => {
    this.setState({
      question: this.props.question,
      answers: this.props.answers,
      qid: this.props.qid
  })
}

onOpenModal = (img) => {
  this.setState({
    modalImage: img,
    open: true
  })
}

onCloseModal = () => {
  this.setState({
    open: false
  })
}

  Vote = async () => {
    if(!this.props.uid){
      alert('Please login or register first.')
    } else {
      let qid = this.props.qid
      let aid = this.state.aid
      let uid = this.props.uid
      let body = { qid: qid, uid: uid, aid: aid }
      await axios.post('/api/sendselectedanswer', body)
    }
  }

  updateQidAid = async (val, val2) => {
    if(!this.props.uid){
      alert('Please login or register first')
    } else {
      await this.setState({
        qid: val,
        aid: val2
      })
    }
  }

  render() {
    console.log(this.state)
    const answers = this.props.ansArr.map(ans => {
      return (
        <div className='SingleAnswerDiv' onClick={() => this.updateQidAid(ans.q_id, ans.aid)} key={ans.aid}>
          <img src={ans.ans_img} alt="" className='answer-img' onClick={() => this.onOpenModal(ans.ans_img)}/>
          <h4>{ans.answer}</h4>
        </div>
      )
    })

    return (
      <div className='Vote'>
        <h1>Cast Your Vote</h1>
        <div className='VotingDiv'>
          <img src={this.props.q_img} alt="question pic" className='question-img'/>
          <h2>{this.props.question}</h2>
          {answers}
          <div>
            <Link to='/Result'><button onClick={() => this.Vote(this.state.anwser)}>Submit Vote</button></Link>
          </div>

        </div>
        <Modal open={this.state.open} onClose={() => this.onCloseModal()} center >
          <div className="Image-Modal-Wrapper">
            <img src={this.state.modalImage} alt="modal" className="Modal-Image"/>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  return {
    uid: reduxState.uid,
    qid: reduxState.qid,
    q_img: reduxState.q_img,
    question: reduxState.question,
    ansArr: reduxState.ansArr
  }
}

const mapDispatchToProps = {
  updateQuestion,
  updateAnsArray
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)