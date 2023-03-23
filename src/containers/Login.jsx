import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Cookie from "js-cookie";
import Formsy from "formsy-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login } from "../backend/utility";
import SwalAutoHide from "sweetalert2";

const style = {
  logoWrapper: {
    width: "70%",
    margin: "15px auto 0",
    height: 100 + "px",
  },
  svg: {
    width: "100%",
    fill: "#ffffff",
  },
};
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      email: "",
      password: "",
      loading: false,
    };
  }

  async submit() {
    const { email, password } = this.state;
    const reqBody = {
      email,
      password,
    };
    if (!this.state.loading) {
      this.setState({ loading: true });
      if (email && password) {
        let user = await login(reqBody);
        if (user.message && user.message === "bad password") {
          SwalAutoHide.fire({
            icon: "error",
            timer: 2000,
            title: "Failed.",
            showConfirmButton: false,
            text: "Incorrect Password!",
          });
          this.setState({ loading: false });
          return;
        } else if (user.message && user.message === "user not found") {
          SwalAutoHide.fire({
            icon: "error",
            timer: 2000,
            title: "Failed.",
            showConfirmButton: false,
            text: "No user found with this email!",
          });
          this.setState({ loading: false });
          return;
        }
        if (user._id) {
          localStorage.setItem("user", JSON.stringify(user));
          this.props.history.push("/users");
        }
      } else {
        this.setState({ loading: false });
        alert("Please use an admin user to login!");
      }
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center animated fadeIn login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Formsy onValidSubmit={this.submit.bind(this)}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email"
                          required
                          ref={(input) => (this.email = input)}
                          onChange={(e) =>
                            this.setState({ email: e.target.value })
                          }
                          value={this.state.email}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          required
                          ref={(input) => (this.password = input)}
                          onChange={(e) =>
                            this.setState({ password: e.target.value })
                          }
                          value={this.state.password}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="roomy-blue"
                            className={`px-4 ${
                              this.state.loading ? "disabled" : ""
                            }`}
                          >
                            <i
                              className={`fa fa-spinner fa-pulse ${
                                this.state.loading ? "" : "d-none"
                              }`}
                            />{" "}
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </Formsy>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-roomy-blue py-5 d-md-down-none"
                  style={{ width: 44 + "%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <div
                        style={style.logoWrapper}
                        className={`svg-logo`}
                      ></div>
                      <div
                        className={`text-center`}
                        style={{
                          fontSize: "20px",
                          paddingTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        PupEEE Dashboard
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(connect()(Login));
