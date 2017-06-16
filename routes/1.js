Var start = async function () {
	console.log( 0 );
	for(let I = 0; I <5;i++){
		await new promise(
			function( resolve,reject){
				setTimeout( function(){
					console.log( i );
					resolve(  )
				},1000 );
			}
		)
	}
	await new promise (function(resolve,reject){
		settimeout(function(){
			console.log( 5 );
			resolve(  );
		},5000);

	});
};
start( );
