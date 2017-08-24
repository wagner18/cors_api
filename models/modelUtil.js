import * as _ from 'lodash';

/*
* Validate the Model and load the given Data Object in to the given Model
* @param dataModel - The model that will be loaded with the data
* @param data - The data object to be loaded in to the model
* @return - Populated dataModel
*/
export function loadData(dataModel, data){

	_.forEach(dataModel, (rootProp, rootKey) => {
		if(data[rootKey] != undefined){

			if(_.isArray(rootProp) && _.isPlainObject(rootProp[0])){

					if(_.isArray(data[rootKey])){

						dataModel[rootKey] = [];
						_.forEach(data[rootKey], (arrObj, i) => {
							if(_.isPlainObject(arrObj)){
								let cloneObj = _.clone(rootProp[0]);
								_.forEach(rootProp[0], (subValue, subKey) => {
									if(arrObj[subKey] != undefined){
										cloneObj[subKey] = arrObj[subKey];
									}
								});
								dataModel[rootKey].push(cloneObj);
							}
						});
					}

			}
			else if(_.isPlainObject(rootProp)){

				_.forEach(rootProp, (objProp, objKey) => {
					if(data[rootKey][objKey] != undefined){
						dataModel[rootKey][objKey] = data[rootKey][objKey];
					}
				});

			}
			else{
				dataModel[rootKey] = data[rootKey];
			}

		}
	});

	return dataModel;
}
