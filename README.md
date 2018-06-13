# README
## Install
```js
npm install
npm run start
```  
# [API Click here](https://saberteeth.github.io/River/)  

Control the canvas by typescript. U can use the river create canvas app.

## About catalog
- demo: A web app let your html look like a phone.
- demo_game: A web app that is a game about gomoku.
- release: River's javascript code(ugly).
- src: River's typescript code.

## Simple Example
- Use River create a activity and button.

		class MainActivity extends view.Activity{
			private btn: widget.Button;
			onCreate(){
				this.btn = new widget.Button();
				this.btn.txt = "Button";
				this.btn._btn_bg.src = "path/of/button";
				this.btn._btn_bg_press.src = "path/of/button_press";
				this.btn.addClickEvent(()=>{
					console.log("button adction!");
				})
				this.addchild(this.btn);
			}
		}
River has not only these. Such as ScrollView, Container, animations and Layout u can use. U can use them create a fictitious mobile, even a simple game. 
![](https://github.com/Saberteeth/River/blob/master/demo.png?raw=true)
