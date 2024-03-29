<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>Twilio Voice - Prova</title>
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="{{ asset('/css/bootstrap/bootstrap.min.css') }}">
    <meta name="theme-color" content="#7952b3">

    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>
    <!-- Custom styles for this template -->
    <link href="{{ asset('/css/bootstrap/dashboard.css') }}" rel="stylesheet">
  </head>
  <body>

<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
  <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Prova Twilio</a>

  <div class="navbar-nav">
    <div class="nav-item text-nowrap">
        <input type="hidden" id="nomeUsuarioLogado" name="nomeUsuarioLogado" value="{{Auth::user()->name}}">

      <a class="nav-link px-3" href="{{ route('logout') }}"
        onclick="event.preventDefault();
        document.getElementById('logout-form').submit();">
        {{ __('SAIR') }}
    </a>

    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
        @csrf
    </form>
   </a>
    </div>
  </div>
</header>

<div class="container-fluid">
  <div class="row">
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link" href="calls/">
              <span data-feather="file"></span>
              Chamadas
            </a>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Usuarios Online</span>
          <a class="link-secondary" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
          @include('layouts.usuariosOnline')
      </div>
    </nav>

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="mt-4"></div>
      <h2>@yield('title')</h2>
      <hr>
      <div class='container-fluid'>
          <div class="row">
              @if(session('msg'))
              <p class="msg">{{ session('msg') }} </p>
              @endif
              @yield('content')
        </div>
    </main>
  </div>
</div>

<div id='modalMsgInicio' class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Aviso</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <p>Para teste ao acessar com outro usuario em uma guia anonima
                atualize a pagina com F5 para mostrar ele Online igualmente para chamadas
                ao finalizar uma chamada atualize a pagina para listar na paginação
                não estou trabalhando com dados em RealTime para o projeto. </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">FECHAR</button>
        </div>
      </div>
    </div>
  </div>

    <script src="{{ asset('/js/bootstrap/bootstrap.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js" ></script>
    <script src="{{ asset('/js/bootstrap/dashboard.js') }}"></script>
    <script type="text/javascript">
        $(window).on('load', function() {
           if(localStorage.getItem('mostradoModal') != 'true') {
            localStorage.setItem('mostradoModal', 'true');
            $('#modalMsgInicio').modal('show');
           }
        });
    </script>
  </body>
</html>
