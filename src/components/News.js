import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


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

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
   
    constructor(props){
        super(props);
        this.state ={
            articles: [],
            loading: false,
            page:1,
            totalResults:0
          }
          document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsLizard`;
    }

    async updateNews(){
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a241c57733bc4064abb05193248ea166&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url);
      let parsedData =await data.json();
      console.log(parsedData);
      this.setState({articles: parsedData.articles , totalResults: parsedData.totalResults,
      loading:false})
    }

    async componentDidMount(){
      this.updateNews();
  
    }

    handleNextclick = async()=>{
     
      this.setState({page: this.state.page +1});
      this.updateNews();
    }

     handlePrevclick= async()=>{
      
      this.setState({page: this.state.page -1});
      this.updateNews();
    }
    fetchMoreData = () => {
      // a fake async api call like which sends
      // 20 more records in 1.5 secs
      setTimeout(() => {
        this.setState({
          articles: this.state.articles.concat(Array.from({ length: 20 }))
        });
      }, 1500);
    };

  render() {
    return (
      <div className='container my-3'>
        <h1 className="text-center my-5">NewsLizard - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
          {/* { this.state.loading && <Spinner/>} */}
        <InfiniteScroll dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults.length}
          loader={<Spinner/>}
        >
        <div className="row">
        {this.state.articles.map((element)=>{
            return <div className="col-md-3" key={element.url}>
                      <NewsItem  title={element.title?element.title.slice(0,20):''} description= {element.description?element.description.slice(0,50):""} imageUrl={element.urlToImage} newsUrl={element.url} author={!element.author?"Unknown":element.author} date={element.publishedAt} source={element.source.name}/>
                   </div>
            })}
          </div>
          </InfiniteScroll>
        <div className="container d-flex justify-content-between">
          
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark mx-3" onClick={this.handlePrevclick}>&laquo; Previous</button>
          <button disabled={this.state.page +1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark mx-3" onClick={this.handleNextclick}>Next &raquo;</button>
        </div> 
      </div>
    )
  }
}

export default News
