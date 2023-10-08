export default {
    _: {
        var: 'variable',
        fun: 'function'
    },
    data_kind: {
        STRING: 'string',
        NUMBER: 'numeric',
        BOOLEAN: 'boolean',
        NULL: 'null',
        STRINGS: 'string array',
        NUMBERS: 'numeric array',
        BOOLEANS: 'boolean array',
        ANY: 'any type'
    },
    diagnostic: {
        unterminated_string_constant: 'Unterminated string constant',
        syntax_error: 'Formula syntax error',
        format_error: 'The expected format is [{expect}], the actual format is [{real}]',
        bracket_error: 'brackets error',
        binary_expression_error: 'Binary expression error',
        conditional_expression_error: 'Conditional expression error',
        var_fun_not_exist_error: 'Variable/function does not exist',
        var_not_exist_error: 'Variable does not exist',
        fun_not_exist_error: 'Function does not exist',
        param_not_exist_error: 'Missing parameters',
        fun_format_error: 'Function format error',
        namespace_not_exist_error: 'Namespace does not exist',
        param_length_error: 'The expected parameter length is [{expect}], the actual length is [{real}]',
    },
    executor: {
        param_value_not_exist_error: 'Parameter [{var}] value does not exist',
        execute_error: 'Formula execution error:'
    },
    editor: {
        placeholder: 'Enter formula here',
        debug: 'Debug',
        search_var: 'Search variables',
        search_fun: 'Search functions/apis',
        empty: 'No data',
        tips: 'Tips',
        tip1: 'Instructions for use can be displayed here when pointing to the function on the right',
        tip2: 'Click the function on the right to insert it at the position of the cursor in the formula editor',
        tip3: 'Entering any characters in the formula editor will display a list of available variables/functions',
        tip4: 'Enter in the formula editor <b>{entrance}</b> a list of available categories will be displayed',
    },
    debug: {
        run: 'Run',
        result: 'Result',
        formula_error: 'Please correct the formula error before running'
    },
    fun_lib: {
        inner: 'built-in',
        cate_common: 'COMMON',
        cate_calc: 'CALC',
        cate_txt: 'TXT',
        cate_time: 'TIME',
        cate_api: 'API',
        sum_label: 'Sum',
        sum_note: `Get the sum of a set of values. <br/>
        Usage: <span style='color: #529b2e'>sum(number 1, number 2,...)</span>`,
        now_label: 'Current time',
        now_note: `Returns the current timestamp`,
        concat_label: 'Merge text',
        concat_note: `Combine multiple texts into one text.<br/>
        Usage: <span style='color: #529b2e'>concat(text1,text2,...)</span>`,
        lower_label: 'Convert to lowercase',
        lower_note: `Convert all uppercase letters in a text to lowercase letters. <br/>
        Usage: <span style='color: #529b2e'>lower(text)</span>`,
        upper_label: 'Convert to uppercase',
        upper_note: `Convert all lowercase letters in a text to uppercase letters. <br/>
        Usage: <span style='color: #529b2e'>upper(text)</span>`,
        httpGet_label: 'HTTP Get request',
        httpGet_note: `Request an HTTP Get request and return Json format. <br/>
        Usage: <span style='color: #529b2e'>httpGet(https://httpbin.org/get)</span>`,
        httpGet_input1: 'Request address',
    }
}