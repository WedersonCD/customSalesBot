const productsConfig = {}

productsConfig.FILE_NAME='products';
productsConfig.COLUMN_ID='Material - Pai';
productsConfig.COLUMN_COLOR='Material - Cor';
productsConfig.COLUMN_TO_AGRUP=[productsConfig.COLUMN_ID,productsConfig.COLUMN_COLOR,'URL Imagem','Quantidade Estoque Loja','Material - Tamanhos Disponíveis'];

productsConfig.DISTINCT_ID_PREFIX='P_';
productsConfig.DISTINCT_ID_COLUMN='!codigo';
productsConfig.QTD_GROUPED_PRODUCTS_PER_REQUISITION=15
productsConfig.STORE_PATH = '../data/products';


module.exports =productsConfig