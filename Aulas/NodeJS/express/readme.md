# Express
Para instalar `npm i express`, segue a [documentação](https://expressjs.com/pt-br/).

## Exemplo básicos com Express
[Express1.js](express1.js)

[Request documentação](https://expressjs.com/pt-br/api.html#req)

[Response documentação](https://expressjs.com/pt-br/api.html#res)
### Requisição na raiz usando o método GET na porta 5001

    const express = require('express');
    const app = express();

    app.get('/',function(request,response){
        response.send('<h1>Exemplo com Express Basico</h1>');
    }).listen(5001);

Aqui você importa o express ao seu projeto `const express = require('express');`, porém nesse caso estamos usando como função esse objeto importado, conforme visto aqui `const app = express();`, é com base nesse objeto que foi pego através da função `express()` que começa toda a lógica. Lembrando que o *express* seria uma espécie de módulo *HTTP* mais avançado, logo devemos definir uma porta para que possa ouvir também: `.listen(5001);`, recomenda-se sempre colocar o *listen* na rota mais genérica de todas.

#### Explicando o método GET
###### Código
    app.get('/',function(request,response){
        response.send('<h1>Exemplo com Express Basico</h1>');
    }).listen(5001);

##### Explicando GET
O método *get* está presente dentro do objeto, assim como todos os verbos *http*, de todo modo os métodos aceitam dois argumentos, o primeiro é o Path ao qual a callback passada como segundo argumento irá atender. Essa callback tem três argumentos, o primeiro para tratar os dados do usuário *request*, segundo os recursos do servidor *response* e por fim o *next*, que foi omitido, sem grandes problemas aqui, devido ao fato de ter apenas uma única rota, o next foi omitido, mas pode haver efeitos colaterais se isso for feito em roteamento mais complexo. [Request mais informações](https://expressjs.com/pt-br/api.html#req), [Response mais informações](https://expressjs.com/pt-br/api.html#res). [Mais inforações sobre o método GET](https://expressjs.com/pt-br/4x/api.html#app.get.method).

### Outros métodos na porta 5002
[express2](express2.js)

    const express = require('express');
    const app = express();
    const port = 5002;

    app.get('/',function(req,res,next){    
        res.write('<h1>Abra o console para entender o exemplo</h1>');
        res.write(`<button onclick="fetch('http://localhost:${port}',{method:'POST'}).then(console.log);">POST</button>`);
        res.write(`<button onclick="fetch('http://localhost:${port}',{method:'PUT'}).then(console.log);">PUT</button>`);
        res.write(`<button onclick="fetch('http://localhost:${port}',{method:'DELETE'}).then(console.log);">DELETE</button>`);
        next();
    }).listen(port)

    app.post('/',function(req,res,next){
        console.log('Requisicao POST');
        res.sendStatus(201);
        next();
    });

    app.put('/',function(req,res,next){
        console.log('Requisicao PUT');
        res.sendStatus(202);
        next();
    });

    app.delete('/',function(req,res,next){
        console.log('Requisicao DELETE');
        res.sendStatus(204);
        next();
    });

Assim como temos com o *GET* existe com outros métodos também, no caso seria `app.[verbo HTTP]()`, devendo `[verbo HTTP]` a ser substituído pelo verbo *HTTP* correspondente.  

#### método: send, sendStatus, write do response
O `send` de `response.send` deve ser usado quando você quer enviar uma única resposta ao cliente, ao ser usado o conteúdo dentro dos parentes é enviado ao cliente e após isso a comunicação é encerrada. O método `sendStatus` envia um status ao cliente, ou seja um código *HTTP*, interessante para uma requisicição tipo delete, ao qual não há dados a ser enviado, mas se faz necessário informar que a requisição deu certo.

    app.delete('/',function(req,res,next){
        console.log('Requisicao DELETE');
        res.sendStatus(204);
        next();
    });

Por fim o *write* permite que você envie várias informações ao cliente de maneira parcial, sem o incomodo do método *send* que encerra a conexão e serve para fazer um envio único, segue o exemplo do write:

    app.get('/',function(req,res,next){    
        res.write('<h1>Abra o console para entender o exemplo</h1>');
        res.write(`<button onclick="fetch('http://localhost:${port}',{method:'POST'}).then(console.log);">POST</button>`);
        res.write(`<button onclick="fetch('http://localhost:${port}',{method:'PUT'}).then(console.log);">PUT</button>`);
        res.write(`<button onclick="fetch('http://localhost:${port}',{method:'DELETE'}).then(console.log);">DELETE</button>`);
        next();
    }).listen(port)

### Trabalhando com Parametros na porta 5003
[express3.js](express3.js)

    const express = require('express');
    const app = express();
    const port = 5002;

    app.get('/:id', (req,res,nex) => res.send(`<h1>com Parametros: ${req.params.id} </h1>`));
    app.get('/', (req,res,nex) => res.send('<h1>Sem parametros </h1>')).listen(port);

    console.log('executando');

No caso você pode tratar rotas com parametros, informando na url com 2 pontos aonde estará o parametro, como aqui `'/:id'`, que significa que ao acessar a rota principal passando argumento, será a callback registrada aqui, que irá tratar essa requisição. Dentro do objeto *request*, que é o primeiro argumento da callback que trata qualquer requisição, tem um array que funciona de maneira semelhante ao `$_GET` ao do PHP, seu nome é `params`, como nesse exemplo aqui `req.params.id`, no caso esse parametro **id**, passado aqui `'/:id'` é resgatado aqui `req.params.id`, se por exemplo o nome do argumento for *arg*, no exemplo `'/:arg'`, no caso para recuperar o valor passado ali `req.params.arg`. Para resumir: `'/:[parametro]'` => `req.params.[parametro]`.

### Suporte a expressão regular
[express4.js](express4.js)

    const express = require('express');
    const app = express();

    app.get('/ab?cd', (req,res,next) => res.send('YES OK!'));
    app.get('/', (req,res,next) => res.send('NOT OK!')).listen(5004);

*Aqui estão alguns exemplos de caminhos de rota baseados em padrões de sequência, este caminho de rota irá corresponder ao acd e abcd.*

### Middleware para carregar arquivos dentro de uma pasta
[express_middleware](express_middleware.js)

    const express = require('express');
    const app = express();

    function fn(arg = "Raiz"){
        let str = `
            
        <p>
            <a href="http://localhost:5000/index1.html">index1.html</a>
        </p>
        <p>
            <a href="http://localhost:5000/index2.html">index2.html</a>
        </p>        
        `;
        str += `<p>${arg}</p>`;
        return str;
    }

    app.use(express.static('use'));
    app.get('/:p?', (req,resp) => resp.send(fn(req.params.p)))
    .listen(5000);

#### O método USE
O método *USE* é uma forma de implementar *middleware*, conforme visto aqui `app.use(express.static('use'));`, então dentro do método *use* você passa uma função e essa função irá fazer o processamento dentro do express, nesse caso é passado o `express.static('use')`, que basicamente pega a pasta *use* e cria uma rota para cada arquivo la dentro, você pode ver um exemplo disso, você pode perceber que os dois arquivos *html* dessa pasta [use](./use/), confore analisado acima, então o middleware *static*, cria uma rota para cada arquivo, lembrando que essa pasta está na raiz, uma vez que não é informado o path.

#### Parametros opcionais
Você pode informar que um parametro é opcional usando um interrogação, conforme visto aqui `'/:p?'`, no caso o interrogação diz que a rota pode ou não ter o parametro `:p`.