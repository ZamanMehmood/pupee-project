import React from 'react'
import { Button } from 'reactstrap'
import SwalAutoHide from 'sweetalert2'
import { addUpdateData, getAllData, getDataById } from '../backend/utility'
// import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config'
import Cookie from 'js-cookie'
const token = Cookie.get('clobberswap_access_token')

export default class AssociateCompany extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      category: {},
      companyName: '',
      associatedCompany: null,
    }
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      let { id } = this.props.match.params
      this.getAssociatedCompany(id)
    }
    if(this.props.location.state) {
      let { category } = this.props.location.state
      this.setState({ category })
    }
  }

  async getAssociatedCompany(id) {
    try {
      let reqBody = {
        associateCompany_id: id,
      }
      let response = await getDataById('show-associate-company', reqBody)
      if (response.data) {
        this.setState({
          associatedCompany: response.data,
          companyName: response.data.name,
        })
      }
    } catch (error) {
      SwalAutoHide.fire({
        icon: 'error',
        timer: 2000,
        title: 'Failed.',
        showConfirmButton: false,
        text: 'Something went wrong!',
      })
    }
  }

  async handleSubmit(e) {
    e.preventDefault()
    let reqBody = {
      name: this.state.companyName,
      category_id: this.state.category.id,
    }
    let result, message = ""
    if (this.state.associatedCompany) {
      reqBody.category_id = this.state.associatedCompany.category_id
      reqBody.associate_company_id = this.state.associatedCompany.id
      result = await addUpdateData('update-associate-company', reqBody);
      if(result.data) {
        message = "Associated company has been updated";
      }
    } else {
      result = await addUpdateData('associate-company', reqBody)
      if(result.data) {
        message = "Associate Company Added Successfully"
      }
    }
    if (result.data) {
      SwalAutoHide.fire({
        icon: 'success',
        timer: 2000,
        title: 'Success.',
        showConfirmButton: false,
        text: message,
      })
      this.props.history.push('/associatedCompanies')
    } else {
      SwalAutoHide.fire({
        icon: 'error',
        timer: 2000,
        title: 'Failed.',
        showConfirmButton: false,
        text: 'Something went wrong!',
      })
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Add New Entry {' to ' + this.props.match.params && this.props.match.params.name}</h3>
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
                        onSubmit={(e) => {
                          this.handleSubmit(e)
                        }}
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
                                placeholder="Add Associate Company"
                                className="form-control"
                                value={this.state.companyName}
                                onChange={(e) => {
                                  this.setState({
                                    companyName: e.target.value,
                                  })
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-1 col-sm-1">
                            <Button className="btn btn-success btn-md">
                              {' '}
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
    )
  }
}
