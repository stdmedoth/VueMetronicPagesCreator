/* 
	Author: João Calisto
	Description: Criador de paginas vue para o template Metronic
	Tip: Este pacote trabalha apenas com template Metronic utilizando API criada com o nodecontrollercreator
*/

const conexao = require('./database');
const path = require('path');
const fs = require('fs');
const formatter = require('./formatter');

class VueMetronicPagesCreator{

	create_rowsinput_template(table){
		const template = fs.readFileSync(path.resolve(__dirname, "./templates/rowsinput_template.vue"), 'utf8');
		let rowsinput = "";
		return new Promise((resolve, reject)=>{
			conexao.query('SHOW COLUMNS FROM ' + table, function(error, results, fields) {
				for(let campo of results){
					//console.log(campo );
					rowsinput = rowsinput + template.replace(/{{label}}/g, campo.Field);
					rowsinput = rowsinput.replace(/{{row}}/g, campo.Field);
					rowsinput = rowsinput.replace(/{{Row}}/g, formatter.capitalizeFirstLetter(campo.Field)) + "\n\t";
				}
				resolve(rowsinput);
			});
		});
		
		return rowsinput;
	}

	create_listpage_template(table){
		var template = fs.readFileSync(path.resolve(__dirname, "./templates/listpage_template.vue"), 'utf8');
		template = template.replace(/{{object}}/g, table);
		template = template.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table));
		return template;
	}

	async create_viewpage_template(table){

		let creator = this;
		var template = fs.readFileSync(path.resolve(__dirname, "./templates/viewpage_template.vue"), 'utf8');
		template = template.replace(/{{object}}/g, table);
		template = template.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table));

		let rowsinput = await creator.create_rowsinput_template(table);
		console.log(rowsinput);
		template = template.replace(/{{ObjectRowsInputs}}/g, rowsinput);
		
		return template;
	}

	create_layoutpage_template(table){
		var template = fs.readFileSync(path.resolve(__dirname, "./templates/layoutpage_template.vue"), 'utf8');
		template = template.replace(/{{object}}/g, table);
		template = template.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table));
		return template;
	}

	create_pages(){

		let creator = this;
		conexao.query('SHOW TABLES', function (error, results, fields) {
		    	
		    var tabelas = [];
		    if (error)
		        throw error;

		    results.forEach(() => {
		    	tabelas = results.map( (item, i) => {
		        return item['Tables_in_'+ conexao.config.database];
		      });
		    });

		    if (!fs.existsSync('pages')){
		    	fs.mkdirSync('pages');
		    }

		    for (let tabela of tabelas) {
		    	let obj_dir = "pages/" + formatter.capitalizeFirstLetter(tabela);
		    	if (!fs.existsSync(obj_dir)){
          			fs.mkdirSync(obj_dir);
        		}
        		let obj_viewfile = "pages/" + formatter.capitalizeFirstLetter(tabela) + "/" + formatter.capitalizeFirstLetter(tabela) + ".vue"
				creator.create_viewpage_template(tabela).then((view_template)=>{
					//console.log(view_template);
					fs.writeFile( obj_viewfile, view_template, { overwrite: true }, function(err) {
	          			if(err) {
	              			return console.log(err);
	          			}
	          			console.log("View criada!");
	      			});

	      			let obj_listfile = "pages/" + formatter.capitalizeFirstLetter(tabela) + ".vue"
	      			let list_template = creator.create_listpage_template(tabela);
	      			fs.writeFile( obj_listfile, list_template, { overwrite: true }, function(err) {
	          			if(err) {
	              			return console.log(err);
	          			}
	          			console.log("List criada!");
	      			});	
				});
		    }
		});
	}	
}


let pages = new VueMetronicPagesCreator();

pages.create_pages();