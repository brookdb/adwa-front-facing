<?php
  //Compare objects based on any field (for sorting)
  function cmp($a, $b){
    return strcmp($a['labels'], $b['labels']);
  }


  $app->get('/navigation', function(){
    global $BloggerAPIkey, $blogId;
    //$query = 'https://www.googleapis.com/blogger/v3/blogs/4103557224482300203/posts?labels=main-nav&key=AIzaSyBN1-Hg_a6druhVmlX_bVLKpbTNcoGQnMc;
    $navigationQuery = 'https://www.googleapis.com/blogger/v3/blogs/'.$blogId.'/posts?labels=main-nav&key='.$BloggerAPIkey;
    $navigationData = json_decode(file_get_contents($navigationQuery))->items;
    $mainNavigation = array();
    foreach($navigationData as $page){
      $mainNavigation[] = array(
        "id" => $page->id,
        "title" => $page->title,
        "href" => strtolower(preg_replace("/\s+/", "-", $page->title)),
        "labels" => $page->labels[1]
      );
    }
    usort($mainNavigation, "cmp");
    echoResponse(200, $mainNavigation);
  });
  $app->get('/landing', function(){
    global $BloggerAPIkey, $blogId;
    //$query = 'https://www.googleapis.com/blogger/v3/blogs/4103557224482300203/posts?labels=landing&key=AIzaSyBN1-Hg_a6druhVmlX_bVLKpbTNcoGQnMc;
    $landingPostQuery = 'https://www.googleapis.com/blogger/v3/blogs/'.$blogId.'/posts/?labels=landing&key='.$BloggerAPIkey;
    $landingPostData = json_decode(file_get_contents($landingPostQuery))->items[0];
    $landingPost = array(
      "id" => $landingPostData->id,
      "title" => $landingPostData->title,
      "content" => $landingPostData->content
    );
    echoResponse(200, $landingPost);
  });


  $app->post('/page', function() use ($app){
    global $blogId, $BloggerAPIkey;
    $r = json_decode($app->request->getBody());

    verifyRequiredParams(array('postID'),$r->post);
    $postID = $r->post->postID;
    $singlePostQuery = 'https://www.googleapis.com/blogger/v3/blogs/'.$blogId.'/posts/'.$postID.'?key='.$BloggerAPIkey;
    $singlePostData = json_decode(file_get_contents($singlePostQuery));
    $singlePost = array(
      "id" => $singlePostData->id,
      "title" => $singlePostData->title,
      "content" => $singlePostData->content
    );
    echoResponse(200, $singlePost);
  });

  $app->get('/articles', function(){
    global $BloggerAPIkey, $blogId;
    //$query = 'https://www.googleapis.com/blogger/v3/blogs/4103557224482300203/posts?labels=main-nav&key=AIzaSyBN1-Hg_a6druhVmlX_bVLKpbTNcoGQnMc;
    $ArticlesQuery = 'https://www.googleapis.com/blogger/v3/blogs/'.$blogId.'/posts?labels=articles&key='.$BloggerAPIkey;
    $ArticlesData = json_decode(file_get_contents($ArticlesQuery))->items;
    $Articles = array();
    foreach($ArticlesData as $page){
      $Articles[] = array(
        "id" => $singleArticleData->id,
        "title" => $singleArticleData->title,
        "content" => $singleArticleData->content,
        "published" => $singleArticleData->published,
        "updated" => $singleArticleData->updated,
        "author" => $singleArticleData->author
      );
    }
    usort($mainNavigation, "cmp");
    echoResponse(200, $Articles);
  });

  $app->post('/single-article', function() use ($app){
    global $blogId, $BloggerAPIkey;
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('postID'),$r->post);
    $postID = $r->post->postID;
    $singleArticleQuery = 'https://www.googleapis.com/blogger/v3/blogs/'.$blogId.'/posts/'.$postID.'?key='.$BloggerAPIkey;
    $singleArticleData = file_get_contents($singleArticleQuery);
    $singleArticle = array(
      "id" => $singleArticleData->id,
      "title" => $singleArticleData->title,
      "content" => $singleArticleData->content,
      "published" => $singleArticleData->published,
      "updated" => $singleArticleData->updated,
      "author" => $singleArticleData->author
    );
    echoResponse(200, $singleArticle);
  });

 ?>
