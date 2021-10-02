import React, {useEffect, useState} from "react";
import './styles/App.css'
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import PostFilter from "./components/PostFilter";
import MyModal from "./components/UI/MyModal/MyModal";
import MyButton from "./components/UI/button/MyButton";
import {usePosts} from "./components/hooks/usePosts";
import PostService from "./components/API/PostService";
import Loader from "./components/UI/loader/Loader";
import {useFetching} from "./components/hooks/useFetching";
import {getPageCount} from "./components/utils/pages";
import Pagination from "./components/UI/pagination/Pagination";
import {usePagination} from "./components/hooks/usePagination";


function App() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
  // let pagesArray = getPagesArray(totalPages)    // заменил на свой хук usePagination
  let pagesArray = usePagination(totalPages)

  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page)
    setPosts(response.data)
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit))
  })

  useEffect(() => {
    fetchPosts()
  }, [page])
  // Получаем newPost из дочернего компонента и добавляем его к списку
  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }
  // Получаем Post из дочернего компонента для его удаления
  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setPage(page)
  }

  return (
    <div className="App">
      <button onClick={fetchPosts}>GET POSTS</button>
      <MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <hr style={{margin: '15px 0'}}/>
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      {postError &&
      <h1>Произошла ошибка {postError}</h1>
      }
      {isPostsLoading
        ?
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><Loader/></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Посты про JS"/>
      }
      <Pagination
        page={page}
        changePage={changePage}
        totalPages={totalPages}
      />

      {/*<div className='page__wrapper'>*/}
      {/*  {pagesArray.map(p =>*/}
      {/*    <span*/}
      {/*      onClick={() => changePage(p)}*/}
      {/*      key={p}*/}
      {/*      className={page === p ? 'page page__current' : 'page'}*/}
      {/*    >*/}
      {/*        {p}*/}
      {/*      </span>*/}
      {/*  )}*/}
      {/*</div>*/}


    </div>
  );
}


export default App;































