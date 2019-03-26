import React, {Component} from 'react';
import {Row, Button, Col} from 'react-materialize';

class Company extends Component {

    componentWillMount() {
        this.props.history.push('/read');
        document.title = "Safe Vault"
    }

    readBtnHandler() {
        this.props.history.push('/read');
    }

    writeBtnHandler() {
        this.props.history.push('/write');
    }

    render() {
        return (
            <Row s={12}>
                <Col s={4}></Col>
                <Col s={4}>
                    <Row>
                        <Col s={6}>
                            <Button onClick={this.readBtnHandler.bind(this)}
                                    style={{width: '200px', backgroundColor: '#89129E'}}>Read</Button>
                        </Col>
                        <Col s={6}>
                            <Button onClick={this.writeBtnHandler.bind(this)}
                                    style={{width: '200px', backgroundColor: '#89129E'}}>Write</Button>
                        </Col>
                    </Row>
                </Col>
                <Col s={4}></Col>
            </Row>
        )
    }
}

export default (Company);
