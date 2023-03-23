import React from "react";
import Cookie from "js-cookie";
import SwalAutoHide from "sweetalert2";
import { Link } from "react-router-dom";
import { getAllData, deleteRecord, searchData } from "../backend/utility";
const token = Cookie.get("clobberswap_access_token");
export default class Expertise extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expertise: [],
      searchQuery: "",
    };
  }
  async componentDidMount() {
    if (Cookie.get("token")) {
      this.getAllExpertise();
    } else {
      this.props.history.push("/login");
    }
  }

  async getAllExpertise() {
    let { data } = await getAllData("show-expertise");
    this.setState({
      expertise: data,
    });
  }

  async deleteExpertise(expertise) {
    let reqBody = {
      expertise_id: expertise.id,
    };
    let result = await deleteRecord("delete-expertise", reqBody);
    let message = "";
    result
      ? (message = "Expertise Deleted Successfully")
      : "Something went wrong!";
    if (result) {
      this.getAllExpertise();
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: message,
      });
    } else {
      SwalAutoHide.fire({
        icon: "success",
        timer: 2000,
        title: "Success.",
        showConfirmButton: false,
        text: message,
      });
    }
  }

  async handleSearch() {
    let { searchQuery } = this.state;
    searchQuery = searchQuery.trim();
    let searchResults;
    if (searchQuery.length > 0) {
      let reqBody = {
        query: searchQuery,
      };
      searchResults = await searchData("search-expertise", reqBody);
      if (searchResults.data && searchResults.data.length > 0) {
        this.setState({ expertise: searchResults.data, searchQuery: "" });
      } else {
        this.setState({ expertise: [], searchQuery: "" });
      }
    } else {
      this.getAllExpertise();
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-md-4 col-xs-12 col-sm-12">
              <h3>List of Expertise</h3>
            </div>
            <div className="col-md-4 col-xs-12 col-sm-12">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.searchQuery}
                  onChange={(event) =>
                    this.setState({ searchQuery: event.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn">
                  <button
                    type="button"
                    onClick={() => this.handleSearch()}
                    className="btn btn-info search-btn"
                  >
                    Search
                  </button>
                </span>
              </div>
            </div>
            <div className="col-sm-4 pull-right mobile-space">
              <Link to={"/addExpertise"}>
                <button type="button" className="btn btn-success">
                  Add new Expertise
                </button>
              </Link>
            </div>

            {/* <div className="col-sm-4 pull-right mobile-space">
              <Link to={"/addExpertise"}>
                <button type="button" className="btn btn-success">
                  Add new Expertise
                </button>
              </Link>
            </div> */}
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name </th>
                  <th>Category </th>
                </tr>
              </thead>

              <tbody>
                {this.state.expertise &&
                  this.state.expertise.map((experti, index) => {
                    return (
                      <tr key={experti.id}>
                        <td>{index + 1}</td>

                        <td>{experti.name}</td>
                        <td>{experti.category && experti.category.name}</td>

                        <td>
                          <button
                            onClick={() => {
                              this.deleteExpertise(experti);
                            }}
                            className={`btn btn-sm btn-danger`}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          <Link to={`/updateExpertise/${experti.id}`}>
                            <button className={`btn btn-sm btn-success`}>
                              Update
                            </button>
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/addExpertise/${
                              experti.category && experti.category.id
                            }`}
                          >
                            <button className={`btn btn-sm btn-success`}>
                              Add
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
