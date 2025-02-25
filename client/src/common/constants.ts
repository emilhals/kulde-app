export const ACTIONS = {
  SELECT: "SELECT",
  WRITE: "WRITE",
  ADD: "ADD",
  CONNECTOR: "CONNECTOR",
  DOWNLOAD: "DOWNLOAD"
}

export const STATE = {
  MOVING: false,
  IDLE: false,
}

export const COMPONENTS = [
  {
    id: "filter-dryer",
    name: "Filter dryer",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Maecenas pulvinar felis ex, sed aliquet elit aliquam nec.Integer ac blandit urna.Donec ac elit at est lobortis pretium.Duis mollis feugiat leo at luctus.Integer bibendum felis sit amet diam tempor, vel pretium quam condimentum.Maecenas in turpis nulla.Phasellus vulputate tempus dui nec pulvinar. Maecenas dapibus congue eros vel semper.Proin faucibus vitae ipsum eget pharetra.Donec vitae nisi non est ultricies efficitur.Ut maximus magna eu sollicitudin ornare.Sed vel turpis lacinia, pharetra felis et, condimentum nunc.Sed venenatis risus at dui pellentesque, egestas accumsan ex fringilla.Pellentesque euismod ultrices enim, quis tincidunt odio feugiat ut.Sed at enim fringilla, consequat erat ac, fringilla urna.Ut suscipit tempus nisi, vel tempor neque euismod a. Fusce bibendum justo eget eros dapibus, sed eleifend nibh commodo.Duis non urna eros.Nunc quis arcu placerat, lobortis sem eu, accumsan orci.Donec lectus justo, egestas ut metus vel, pretium commodo turpis.Etiam nunc nunc, tempus vel maximus vitae, gravida eu urna.Vivamus sed hendrerit nibh.Pellentesque nec mi elit. Nulla interdum vulputate fermentum.Sed sit amet facilisis justo, eu sollicitudin dui.Nam cursus sagittis sapien.Donec in nunc dolor.Cras posuere at massa sit amet scelerisque.Nam in felis a odio suscipit pharetra.Donec at dolor eros.Morbi ullamcorper, ipsum in egestas blandit, tortor tortor tincidunt nibh, sit amet efficitur neque lacus eu felis.Pellentesque consectetur id justo a sollicitudin.Etiam varius dui id metus bibendum bibendum. Ut at condimentum lectus.Duis sollicitudin purus quis pretium imperdiet.Nam convallis, justo vel pulvinar dignissim, tortor ex porttitor magna, vel dictum ipsum risus eget lorem.Ut non laoreet ante.Phasellus finibus odio vel eleifend placerat.Vestibulum ornare magna nec mauris iaculis feugiat.Maecenas vel mollis justo.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Ut vitae augue facilisis lectus gravida congue.Sed mollis nisi ut feugiat molestie.Phasellus sit amet justo non diam luctus convallis in porttitor est.Vivamus pharetra justo sapien, molestie feugiat dui placerat laoreet.In et mi sed felis vulputate varius. ",
    shader_type: "shiny",
    color: "black",
    file_name: "DML 052.obj",
    web_link: "",
  },
  {
    id: "sight-glass",
    name: "Sight glass",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Maecenas pulvinar felis ex, sed aliquet elit aliquam nec.Integer ac blandit urna.Donec ac elit at est lobortis pretium.Duis mollis feugiat leo at luctus.Integer bibendum felis sit amet diam tempor, vel pretium quam condimentum.Maecenas in turpis nulla.Phasellus vulputate tempus dui nec pulvinar. Maecenas dapibus congue eros vel semper.Proin faucibus vitae ipsum eget pharetra.Donec vitae nisi non est ultricies efficitur.Ut maximus magna eu sollicitudin ornare.Sed vel turpis lacinia, pharetra felis et, condimentum nunc.Sed venenatis risus at dui pellentesque, egestas accumsan ex fringilla.Pellentesque euismod ultrices enim, quis tincidunt odio feugiat ut.Sed at enim fringilla, consequat erat ac, fringilla urna.Ut suscipit tempus nisi, vel tempor neque euismod a. Fusce bibendum justo eget eros dapibus, sed eleifend nibh commodo.Duis non urna eros.Nunc quis arcu placerat, lobortis sem eu, accumsan orci.Donec lectus justo, egestas ut metus vel, pretium commodo turpis.Etiam nunc nunc, tempus vel maximus vitae, gravida eu urna.Vivamus sed hendrerit nibh.Pellentesque nec mi elit. Nulla interdum vulputate fermentum.Sed sit amet facilisis justo, eu sollicitudin dui.Nam cursus sagittis sapien.Donec in nunc dolor.Cras posuere at massa sit amet scelerisque.Nam in felis a odio suscipit pharetra.Donec at dolor eros.Morbi ullamcorper, ipsum in egestas blandit, tortor tortor tincidunt nibh, sit amet efficitur neque lacus eu felis.Pellentesque consectetur id justo a sollicitudin.Etiam varius dui id metus bibendum bibendum. Ut at condimentum lectus.Duis sollicitudin purus quis pretium imperdiet.Nam convallis, justo vel pulvinar dignissim, tortor ex porttitor magna, vel dictum ipsum risus eget lorem.Ut non laoreet ante.Phasellus finibus odio vel eleifend placerat.Vestibulum ornare magna nec mauris iaculis feugiat.Maecenas vel mollis justo.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Ut vitae augue facilisis lectus gravida congue.Sed mollis nisi ut feugiat molestie.Phasellus sit amet justo non diam luctus convallis in porttitor est.Vivamus pharetra justo sapien, molestie feugiat dui placerat laoreet.In et mi sed felis vulputate varius. ",
    shader_type: "shiny",
    color: "black",
    file_name: "danfoss_sgn_odf_22s_inch.obj"
  },
  {
    id: "cond-press-reg",
    name: "Condensing pressure regulator",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Maecenas pulvinar felis ex, sed aliquet elit aliquam nec.Integer ac blandit urna.Donec ac elit at est lobortis pretium.Duis mollis feugiat leo at luctus.Integer bibendum felis sit amet diam tempor, vel pretium quam condimentum.Maecenas in turpis nulla.Phasellus vulputate tempus dui nec pulvinar. Maecenas dapibus congue eros vel semper.Proin faucibus vitae ipsum eget pharetra.Donec vitae nisi non est ultricies efficitur.Ut maximus magna eu sollicitudin ornare.Sed vel turpis lacinia, pharetra felis et, condimentum nunc.Sed venenatis risus at dui pellentesque, egestas accumsan ex fringilla.Pellentesque euismod ultrices enim, quis tincidunt odio feugiat ut.Sed at enim fringilla, consequat erat ac, fringilla urna.Ut suscipit tempus nisi, vel tempor neque euismod a. Fusce bibendum justo eget eros dapibus, sed eleifend nibh commodo.Duis non urna eros.Nunc quis arcu placerat, lobortis sem eu, accumsan orci.Donec lectus justo, egestas ut metus vel, pretium commodo turpis.Etiam nunc nunc, tempus vel maximus vitae, gravida eu urna.Vivamus sed hendrerit nibh.Pellentesque nec mi elit. Nulla interdum vulputate fermentum.Sed sit amet facilisis justo, eu sollicitudin dui.Nam cursus sagittis sapien.Donec in nunc dolor.Cras posuere at massa sit amet scelerisque.Nam in felis a odio suscipit pharetra.Donec at dolor eros.Morbi ullamcorper, ipsum in egestas blandit, tortor tortor tincidunt nibh, sit amet efficitur neque lacus eu felis.Pellentesque consectetur id justo a sollicitudin.Etiam varius dui id metus bibendum bibendum. Ut at condimentum lectus.Duis sollicitudin purus quis pretium imperdiet.Nam convallis, justo vel pulvinar dignissim, tortor ex porttitor magna, vel dictum ipsum risus eget lorem.Ut non laoreet ante.Phasellus finibus odio vel eleifend placerat.Vestibulum ornare magna nec mauris iaculis feugiat.Maecenas vel mollis justo.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Ut vitae augue facilisis lectus gravida congue.Sed mollis nisi ut feugiat molestie.Phasellus sit amet justo non diam luctus convallis in porttitor est.Vivamus pharetra justo sapien, molestie feugiat dui placerat laoreet.In et mi sed felis vulputate varius. ",
    shader_type: "shiny",
    color: "green",
    file_name: "ImageToStl.com_kvr 35.obj",
  }
]
