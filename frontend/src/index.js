import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// for codepen.io
// import React from 'https://esm.sh/react@18.2.0';
// import ReactDOM from 'https://esm.sh/react-dom@18.2.0';




// standard code for React v.18
// document.body.innerHTML = "<div id='root'></div>";
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(a React component);
// setTimeout(() => console.log(document.getElementById("root").innerHTML), 300);





// Q: toggle message
// class Message extends React.Component  {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showP: false,
//     };
//   }
  
//   render() {
//     const togglePara = () => {
//       if (this.state.showP) {
//         this.setState({ showP: false });
//       } else {
//         this.setState({ showP: true });
//       }
//     };
    
//     return (
//       <React.Fragment>
//           <a onClick={togglePara} href="#">Want to buy a new car?</a>
//           {this.state.showP && (<p>Call +11 22 33 44 now!</p>)}
//       </React.Fragment>
//     );
//   }
// }




// Q: todo list
// const TodoItem = (props) => <li onClick={props.onClick}>{props.item.text}</li>;
//
// class TodoList extends React.Component {
//   render() {
//     const { items, onListClick } = this.props;
//     return (
//       <ul>
//         {items.map((item, index) => (
//           <TodoItem
//             item={item}
//             key={index}
//             onClick={this.handleItemClick.bind(this, item)}
//           />
//         ))
//         // a funny binding above... (and add one more parameter)
//         }
//       </ul>
//     );
//   }

//   handleItemClick(item, event) {
//     if (!item.done) {
//       this.props.onItemClick(item, event);
//       this.props.onListClick(event);
//     }
//   }
// }

