/** Replace these with your own API keys, username and roomId from Chatkit  */
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/628709ea-0dc8-4d43-994f-f033c0c623a1/token";
const instanceLocator = "v1:us1:628709ea-0dc8-4d43-994f-f033c0c623a1";
const roomId = 19397562;
const username = 'padhikary';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: []
        };
        this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: instanceLocator,
            userId: 'padhikary',
            tokenProvider: new Chatkit.TokenProvider({
                url: testToken
            })
        });

        chatManager.connect()
            .then(currentUser => {
                this.currentUser = currentUser;
                this.currentUser.subscribeToRoom({
                    roomId: roomId,
                    hooks: {
                        onNewMessage: message => {

                            this.setState({
                                messages: [...this.state.messages, message]
                            })
                        }
                    }
                })
            })
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: roomId
        })
    }

    render() {
        return (
            <div className="app">
                <Title/>
                <MessageList
                    roomId={this.state.roomId}
                    messages={this.state.messages}/>
                <SendMessageForm
                    sendMessage={this.sendMessage}/>
            </div>
        );
    }
}

class MessageList extends React.Component {
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <li key={message.id} className="message">
                            <div>{message.senderId}</div>
                            <div>{message.text}</div>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

class SendMessageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.sendMessage(this.state.message);
        this.setState({
            message: ''
        })
    }

    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text"/>
            </form>
        )
    }
}

function Title() {
    return <p className="title">React Chat App</p>
}

ReactDOM.render(<App/>, document.getElementById('root'));

