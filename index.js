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

	create_cols_declaration_template(table){
		const template = fs.readFileSync(path.resolve(__dirname, "./templates/cols_declaration_template.vue"), 'utf8');
		let declarations = "";
		return new Promise((resolve, reject)=>{
			conexao.query('SHOW COLUMNS FROM ' + table, function(error, results, fields) {
				let iterations = results.length;
				for(let campo of results){
					//console.log(campo );
					
					declarations = declarations + template.replace(/{{col}}/g, campo.Field)
					
					//declarations = declarations.replace(/{{object}}/g, table) + "\n\t";
					//editget = editget.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table)) + "\n\t";
					if (--iterations){
						declarations = declarations + ",\n\t\t\t";
					}else{
						declarations = declarations + "\n\t\t\t";
					}
				}
				resolve(declarations);
			});
		});	
		return declarations;
	}

	create_editget_template(table){
		const template = fs.readFileSync(path.resolve(__dirname, "./templates/cols_editget_template.vue"), 'utf8');
		let editget = "";
		return new Promise((resolve, reject)=>{
			conexao.query('SHOW COLUMNS FROM ' + table, function(error, results, fields) {

				for(let campo of results){
					//console.log(campo );
					
					editget = editget + template.replace(/{{col}}/g, campo.Field)
					//editget = editget.replace(/{{Col}}/g, formatter.capitalizeFirstLetter(campo.Field));
					
					editget = editget.replace(/{{object}}/g, table) + "\n\t\t\t\t\t";
					//editget = editget.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table)) + "\n\t";
				}
				resolve(editget);
			});
		});
		
		return editget;
	}

	create_cols_listpost_template(table){
		const template = fs.readFileSync(path.resolve(__dirname, "./templates/col_listpost_template.vue"), 'utf8');
		let listpost = "";
		return new Promise((resolve, reject)=>{
			conexao.query('SHOW COLUMNS FROM ' + table, function(error, results, fields) {
				let iterations = results.length;
				for(let campo of results){
					//console.log(campo );
					
					listpost = listpost + template.replace(/{{col}}/g, campo.Field)

					if (--iterations){
						listpost = listpost + ",\n\t\t\t\t";
					}else{
						listpost = listpost + "\n\t\t\t\t";
					}
				}
				resolve(listpost);
			});
		});	
		return listpost;
	}

	create_rowscol_template(table){
		const template = fs.readFileSync(path.resolve(__dirname, "./templates/rowscol_template.vue"), 'utf8');
		let rowscol = "";
		return new Promise((resolve, reject)=>{
			conexao.query('SHOW COLUMNS FROM ' + table, function(error, results, fields) {
				let iterations = results.length;
				for(let campo of results){
					//console.log(campo );
					rowscol = rowscol + template.replace(/{{label}}/g, campo.Field);
					rowscol = rowscol.replace(/{{rowcol}}/g, campo.Field);
					if (--iterations){
						rowscol = rowscol + ",\n\t";
					}else{
						rowscol = rowscol + "\n\t";
					}
				}
				resolve(rowscol);
			});
		});
		
		return rowscol;
	}

	create_insert_rows_template(table){
		const template = fs.readFileSync(path.resolve(__dirname, "./templates/insert_rows_template.vue"), 'utf8');
		let rowscol = "";
		return new Promise((resolve, reject)=>{
			conexao.query('SHOW COLUMNS FROM ' + table, function(error, results, fields) {
				let iterations = results.length;
				for(let campo of results){
					//console.log(campo );
					rowscol = rowscol + template.replace(/{{label}}/g, campo.Field);
					rowscol = rowscol.replace(/{{rowcol}}/g, campo.Field);
					if (--iterations){
						rowscol = rowscol + ",\n\t";
					}else{
						rowscol = rowscol + "\n\t";
					}
				}
				resolve(rowscol);
			});
		});
		
		return rowscol;
	}

	async create_listpage_template(table){

		let creator = this;
		var template = fs.readFileSync(path.resolve(__dirname, "./templates/listpage_template.vue"), 'utf8');
		template = template.replace(/{{object}}/g, table);
		template = template.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table));

		let rowsinput = await creator.create_rowscol_template(table);
		template = template.replace(/{{ObjectColsInputs}}/g, rowsinput);
		return template;
	}

	async create_viewpage_template(table){

		let creator = this;
		var template = fs.readFileSync(path.resolve(__dirname, "./templates/viewpage_template.vue"), 'utf8');
		template = template.replace(/{{object}}/g, table);
		template = template.replace(/{{Object}}/g, formatter.capitalizeFirstLetter(table));

		let rowsinput = await creator.create_rowsinput_template(table);
		template = template.replace(/{{ObjectRowsInputs}}/g, rowsinput);

		let editget = await creator.create_editget_template(table);
		template = template.replace(/{{cols_editget}}/g, editget);

		let declarations = await creator.create_cols_declaration_template(table);
		template = template.replace(/{{cols_declaration}}/g, declarations);

		let listpost = await creator.create_cols_listpost_template(table);
		template = template.replace(/{{col_listpost}}/g, listpost);
		
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
					
					let obj_layoutfile = "pages/" + formatter.capitalizeFirstLetter(tabela) + "/" + "Layout.vue";	      			
	      			let layoutpage_template = creator.create_layoutpage_template(tabela);
	      			fs.writeFile( obj_layoutfile, layoutpage_template, { overwrite: true }, function(err) {
	          			if(err) {
	              			return console.log(err);
	          			}
	          			console.log("View criada!");
	      			});
				});

				let obj_listfile = "pages/" + formatter.capitalizeFirstLetter(tabela) + ".vue";
      			creator.create_listpage_template(tabela).then((list_template)=>{
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