let base;
let baseRef;
let baseHTML;
let baseStyle;
let baseList;
let interval;
let bodyTop;
const topMargin = 45;

function changeSrc (href, title, style) {
  clearInterval(interval)
  interval = null
  document.getElementById('root').innerHTML = "";
  document.title = title;
  base = {href, title, style}
  setHTML(document.getElementById('root'), href);
  localStorage.setItem('css-tailwind', JSON.stringify(base))
}

const checkExamples = (action) => {
  let xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if(action === 'get') {
        baseList = xmlhttp.responseText;
      } else if(action === 'compare') {
        if(baseList !== xmlhttp.responseText) {
          document.location.reload()
        }
      }
    }
  };
  xmlhttp.open("GET", "./examples.js", true);
  xmlhttp.send();
};

const checkHTML = (path, action) => {
  let xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if(action === 'get') {
        baseHTML = xmlhttp.responseText;
      } else if(action === 'compare') {
        if(baseHTML !== xmlhttp.responseText) {
          clearInterval(interval)
          interval = null
          const win = document.getElementById('ifrDoc').contentWindow;
          bodyTop = win.document.documentElement.scrollTop 
            || win.pageYOffset
            || win.document.body.scrollTop;
          setHTML(document.getElementById('root'), base.href);
          setTimeout(() => {
            document.getElementById('ifrDoc').contentWindow.scrollTo(0, bodyTop);
          }, 500);
        }
      }
    }
  };
  xmlhttp.open("GET", path, true);
  xmlhttp.send();
  checkStyle(path, action) 
  checkExamples(action)
};

const checkStyle = (path, action) => {
  let xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if(action === 'get') {
        baseStyle = xmlhttp.responseText;
      } else if(action === 'compare') {
        if(baseStyle !== xmlhttp.responseText) {
          clearInterval(interval)
          interval = null
          const win = document.getElementById('ifrDoc').contentWindow;
          bodyTop = win.document.documentElement.scrollTop 
            || win.pageYOffset
            || win.document.body.scrollTop;
          setHTML(document.getElementById('root'), base.href);
          setTimeout(() => {
            document.getElementById('ifrDoc').contentWindow.scrollTo(0, bodyTop);
          }, 500);
        }
      }
    }
  };
  let keep = path;
  if(path.search('.html') >= 0) {
    const rem = path.split('/').slice(-1);
    keep = path.replace(rem, '');
  }
  xmlhttp.open("GET", `${keep}${base.style}.css`, true);
  xmlhttp.send();
};

function getExamples() {
    const container = document.getElementById('nav');
    for (let example of examples) {
      li = document.createElement('li');
      li.className = 'dropdown-item text-danger';
      li.style = 'cursor: pointer';
      li.id = example.value;
      li.innerText = example.label;
      li.setAttribute('onClick', 
        `changeSrc('${example.value}', '${example.label}', '${
          example.style ? example.style : 'style'
        }')`
      );
      container.appendChild(li);
    }
  }

  function reload(href) {
    base = JSON.parse(localStorage.getItem('css-tailwind'));
    baseRef = href;
    if (document.getElementById('nav').children.length == 0) {
      getExamples();
    }
    if(base && base?.href !== '') {
      changeSrc(base.href, base.title, base.style);
    }
  }

  const setHTML = (el, href) => {
    el.innerHTML = `
    <br>
      <iframe 
        width='100%' 
        height='${innerHeight - 52}' 
        src='${href}' 
        class='inHTML'
        id='ifrDoc'
      ></iframe>`
    checkHTML(href, interval ? 'compare' : 'get');
    interval = setInterval(() => {
      checkHTML(href, interval ? 'compare' : 'get')
    }, 5000);
  };
