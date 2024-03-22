export const sanitizeCode = (code, sourceLanguage) => {
    // Remove leading and trailing whitespace
    code = code.trim();
  
    // Remove unnecessary trailing semicolons
    if(sourceLanguage === 'python' || sourceLanguage === 'go' || sourceLanguage === 'ruby') 
        code = code.replace(/;+\s*$/g, ''); //remove all semicolons at the end for python, go, ruby
    else code = code.replace(/;+\s*$/g, ';'); //keep one for every other language 
  
    // Escape special characters
    code = escapeSpecialCharacters(code);

    return code;
};

const escapeSpecialCharacters = (input) => {
    // Define a mapping of special characters to their escaped counterparts
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#47;',
        '=': '&#61;',
        '`': '&#96;',
        '*': '&#42;',
    };

    // Replace special characters with their escaped counterparts
    return input.replace(/[&<>"'\/=`*]/g, match => escapeMap[match]);
};
