import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {

  static defaultProps ={
    country: 'in',
    pageSize: 8,
    category: 'general'
  }
  static propsTypes ={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }
   
    constructor(){
        super();
        this.state ={
            articles: [],
            loading: false,
            page:1
        }
    }

    async componentDidMount(){
    
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a241c57733bc4064abb05193248ea166&page=1&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url);
      let parsedData =await data.json();
      console.log(parsedData);
      this.setState({articles: parsedData.articles , totalResults: parsedData.totalResults,
      loading:false})
    }

    handleNextclick = async()=>{
      
      
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a241c57733bc4064abb05193248ea166&page=${this.state.page +1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url);
      let parsedData =await data.json();
      this.setState({articles: parsedData.articles,
        page: this.state.page +1,
        loading: false
      })
     
    }

     handlePrevclick= async()=>{
      console.log("Previous");
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a241c57733bc4064abb05193248ea166&page=${this.state.page -1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url);
      let parsedData =await data.json();
      console.log(parsedData);
      this.setState({articles: parsedData.articles,
        page: this.state.page -1,
        loading: false
      })
    }
  render() {
    return (
      <div className='container my-3'>
        <h1 className="text-center">NewsLizard - Top Headlines</h1>
          { this.state.loading && <Spinner/>}
        <div className="row">
        {!this.state.loading && this.state.articles.map((element)=>{
            return <div className="col-md-3" key={element.url}>
                      <NewsItem  title={element.title?element.title.slice(0,20):''} description= {element.description?element.description.slice(0,50):""} imageUrl={element.urlToImage} newsUrl={element.url}/>
                   </div>
            })}
            
        </div>
        <div className="container d-flex justify-content-between">
          
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark mx-3" onClick={this.handlePrevclick}>&laquo; Previous</button>
          <button disabled={this.state.page +1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark mx-3" onClick={this.handleNextclick}>Next &raquo;</button>
        </div>
      </div>
    )
  }
}

export default News
