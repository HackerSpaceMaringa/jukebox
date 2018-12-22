module.exports = {
  mode: 'production',
	entry: './src/main.js',
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: ['babel-loader'],
		}]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	output: {
		path: __dirname + '/public',
		publicPath: '/',
		filename: 'main.min.js',
	},
};
