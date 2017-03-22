import React, { Component } from 'react';
import QuestionsIndex from './components/QuestionsIndex';
import QuestionShow from './components/QuestionShow';
import './App.css';

// Step 1: Test that your API backend working correctly with
//         some fetch requests
//         fetch(
//           'http://localhost:3000/api/v1/questions?api_key=5b57085ae04f8078d2f47230c5442344'
//         )
//         .then(r => r.text()).then(console.info)
// Step 2: Write a method, getQuestions, to fetch all questions from the Awesome
//         Answers API. It should save the questions that it gets back in the
//         state with this.setState after it's complete.
// Step 3: Write a QuestionsIndex component to render all the questions saved in
//         in the state from the previous step. Best practice to keep in its own
//         file and import it.
// Step 4: Write a getQuestion function to fetch the data for one quesiton, then
//         write a QuestionShow component to display that question

const BASE_URL = 'http://localhost:3000/api/v1';
const API_KEY = '41091b742e7ad5f55c6f6c845da6d1a2';

class App extends Component {
  constructor (props) {
    // Don't forget to use super(props) before changing this
    // in any class-based React Component when using the constructor
    super(props);

    this.state = {
      question: null,
      questions: []
    }
    //Don't forget to bind methods used as callbacks ⛓
    this.getQuestion = this.getQuestion.bind(this);
    this.postQuestion = this.postQuestion.bind(this);

  }

  getQuestions () {
    fetch(`${BASE_URL}/questions?api_key=${API_KEY}`)
    .then(r => r.json())
    // once the questions json is parsed from the rail's api
    // we extract it and save it in the state
    .then(({questions}) => this.setState({questions}))
  }

// This is a method and a function 👇
  getQuestion (id) {
    // to add get parameters
    // at the end of a url add a question mark, `?`
    // then, everything that follows will be parameters
    // they're written as such `api_key=78daSDASD7dsa`
    // the above would make a param availabe in the params object of a rails
    // action (e.g. params[:api_key])
    // to have multiple get parameters, seperate each one with a `&`
    // (e.g. `api_key=78daSDASD7dsa&page=3&name=Jane`)
    fetch(`${BASE_URL}/questions/${id}?api_key=${API_KEY}`)
    .then(r => r.json())
    // once the questions json is parsed from the rail's api
    // we extract it and save it in the state
    .then(question => this.setState({ question }))
  }

  postQuestion (question) {
     fetch(
       `${BASE_URL}/questions?api_key=${API_KEY}`,
       {
         // to make a json request with fetch
         // you have to specify that information the hearders
         // - the Accept header tells the server what kind of data
         // we expect in return
         // - the Content-Type header tells the server what kind of data
         // we are sending it
         headers: {
           'Accept': 'application/json, text/plain, */*',
           'Content-Type': 'application/json'
         },
         method: 'POST',
         // JSON.stringify transforms a JavaScript into a JSON formatted
         // string of text
         body: JSON.stringify(question)
       }
     )
     .then(() => { this.getQuestions(); })
     .catch(console.error)
   }

  // componentDidMount is a lifecycle callback that is executed when
  // this component is finally rendered the user's browser
  componentDidMount () {
    this.getQuestions();
    // this.getQuestion(74);
  }

  render() {
    let questionView = '';
    if (this.state.question !== null) {
          questionView = (
            <QuestionShow
              onBackClick={e => {
                e.preventDefault();
                this.setState({question: null});
              }}
              question={this.state.question || {}} />
          );
        } else {
      questionView = (
        <QuestionsIndex
          // onQuestionClick={id => { console.info(id) }}
          onQuestionClick= {this.getQuestion}
          questions={this.state.questions} />
      );
    }
    return (
      <div className="App">
        <h1>Awesome Answers</h1>
        {/* <QuestionNew onSubmit={console.info} /> */}
        <QuestionNew onSubmit={this.postQuestion} />
        {/* <ul>
          {
            this.state.questions.map(
              question => <li key={question.id}>{question.title}</li>
            )
          }
        </ul> */}
        {
          // { } in JSX can only accept expressions and not statements
          // (e.g. if, while, for doesn't work)
          // (this.state.question !== null)
          // ? <QuestionShow question={this.state.question || {}} />
          // : <QuestionsIndex questions={this.state.questions} />
          questionView
        }
      </div>
    );
  }
}

function QuestionNew ({question, onSubmit = () => {}}) {
  const handleSubmit = event => {
    event.preventDefault();
    // the FormData constructor can be used to created
    // form data object from a form node
    // the object will hold the values from all its input
    // fields under their name attribute
    // loop over each with .forEach
    // get individual values with .get('title')
    // set values with .set('title', 'Rob')
    const fData = new FormData(event.currentTarget);
    // debugger;
    onSubmit({
      title: fData.get('title'),
      body: fData.get('body')
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* for is a reserved word in javascript, use htmlFor
          in labels html attributes instead */}
        <label htmlFor="questionTitle">Title: </label>
        <input id="questionTitle" name="title"/>
      </div>
      <div>
        <textarea id="questionBody" name="body">
        </textarea>
      </div>
      <div>
        <input type="submit" value="Submit"/>
      </div>
    </form>
  )
}

export default App;
