import React from "react";
import { Button } from "reactstrap";
import SwalAutoHide from "sweetalert2";
import { addUpdateData, getDataById } from "../backend/utility";
export default class AddLanguage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newLanguage: "",
      languages: [],
      language: {},
      language_id: null
    };
  }

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.language_id) {
      let { language_id } = this.props.match.params;
      this.state.language_id = language_id
      this.getLanguageById(language_id);
    }
  }

  async getLanguageById(id) {
    let reqBody = {
      language_id: id,
    };
    let response = await getDataById("show-language", reqBody);
    if (response.data) {
      this.setState({
        newLanguage: response.data.name,
        language: response.data,
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    let reqBody = {
      name: this.state.newLanguage,
    };
    let result,
      message = "";
    if (this.state.language_id !== null) {
      reqBody.language_id = this.state.language_id;
      result = await addUpdateData("edit-language", reqBody);
      message = "Lanuage has been updated";
      if (result.errors) {
        message = result.errors.name[0];
      }
    } else {
      result = await addUpdateData("add-language", reqBody);
      message = "New language has been added";
    }
    if (result.data) {
      this.setState({ newLanguage: "" });
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: message,
      });
      this.props.history.push("/languages");
    } else {
      SwalAutoHide.fire({
        icon: "error",
        timer: 2000,
        title: "Failed.",
        showConfirmButton: false,
        text: message,
      });
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Add New Language</h3>
            </div>
          </div>

          <div className="row animated fadeIn">
            <div className="col-12">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="x_panel">
                    <div className="x_content">
                      <br />
                      <form
                        id="demo-form2"
                        data-parsley-validate
                        className="form-horizontal form-label-left"
                        onSubmit={(e) => this.handleSubmit(e)}
                      >
                        <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">
                            Name
                          </label>
                          <div className="col-md-8 col-sm-8">
                            <div className="col-md-8 col-sm-8">
                              <input
                                required
                                type="text"
                                name="name"
                                placeholder="Add Language"
                                className="form-control"
                                value={this.state.newLanguage}
                                onChange={(e) => {
                                  this.setState({
                                    newLanguage: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-1 col-sm-1">
                            <Button className="btn btn-success btn-md">
                              Submit
                            </Button>
                          </div>
                        </div>
                        <div className="ln_solid" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
