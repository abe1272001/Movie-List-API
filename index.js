(function () {
  //   write your code here
  const BASE_URL = "https://movie-list.alphacamp.io";
  const INDEX_URL = BASE_URL + "/api/v1/movies/";
  const POSTER_URL = BASE_URL + "/posters/"; //取得圖片海報
  const data = [];
  axios
    .get(INDEX_URL)
    .then((response) => {
      response.data.results.forEach((item) => {
        data.push(item);
      });
      displayDataList(data);
      console.log(data);
      // console.log(data.length);
    })
    .catch((err) => console.log(err));

  function displayDataList(data) {
    let htmlContent = "";
    data.forEach(function (item, index) {
      htmlContent += `<div class="col-sm-3">
        <div class="card mb-2">
          <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
          <div class="card-body movie-item-body">
            <h6 class="card-title">${item.title}</h6>
          </div>

          <!-- "More" button 使用dataset傳入item.id -->
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
      `;
    });
    $("#data-panel").html(htmlContent);
  }

  //顯示當前movie的資訊
  function showMovie(id) {
    const url = INDEX_URL + id
    //將殘留的資訊洗掉
    $("#show-movie-title").html("")
    $("#show-movie-image").html("")
    $("#show-movie-date").html("")
    $("#show-movie-description").html("")
    axios(url).then(response => {
      const data = response.data.results
      // console.log(data)
      $("#show-movie-title").html(data.title)
      $("#show-movie-image").html(`<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`)
      $("#show-movie-date").html(`release at : ${data.release_date}`)
      $("#show-movie-description").html(data.description)
    })
  }


  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
    const movie = data.find(movie => movie.id === Number(id))

    if(list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    }else {
      list.push(movie)
      alert(`${movie.title} is added in your favorite list.`)
    }
    localStorage.setItem("favoriteMovies", JSON.stringify(list))
  }
  
  //點擊more btn 取得 button標籤內的data-id
  $("#data-panel").click(function(e){
    if(e.target.matches(".btn-show-movie")) {
      let id = e.target.dataset.id
      showMovie(id)
    }

    if(e.target.matches(".btn-add-favorite")) {
      let id = e.target.dataset.id
      console.log(id)
      addFavoriteItem(id) 
    }
  })


  

  

  //search function
  $("#search").submit(function(e){
    e.preventDefault()
    const searchInput = $("#search-input").val()
    const regex = new RegExp(searchInput, 'i')
    let results = data.filter(movie => movie.title.match(regex))
    displayDataList(results)
    console.log(results)
  })
  
})();
