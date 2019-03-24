function filterExport(ast) {
    const ctx = {
        default: null,
        name: [],
        declaration: [],
        specifiers: []
    }
    if (!ast && ast.sourceType !== 'module') return ctx

    ast.body.forEach(node => {
        // https://github.com/babel/babylon/blob/master/ast/spec.md#exports
        switch (node.type) {
        case 'ExportNamedDeclaration': {
            if (node.declaration) {
                if (
                    node.declaration.id &&
                        node.declaration.id.type === 'Identifier'
                ) {
                    // type: ClassDeclaration / FunctionDeclaration
                    ctx.name.push(node.declaration.id.name)
                    ctx.declaration.push(node.declaration)
                } else if (
                    node.declaration.declarations &&
                        node.declaration.declarations.length
                ) {
                    // type: VariableDeclaration
                    node.declaration.declarations.forEach(declarator => {
                        if (
                            declarator.id &&
                                declarator.id.type === 'Identifier'
                        ) {
                            ctx.name.push(declarator.id.name)
                            ctx.declaration.push(declarator)
                        }
                    })
                }
            } else if (node.specifiers && node.specifiers.length) {
                node.specifiers.forEach(specifier => {
                    if (
                        specifier.exported &&
                            specifier.exported.type === 'Identifier'
                    ) {
                        ctx.name.push(specifier.exported.name)
                        ctx.specifiers.push(specifier)
                    }
                })
            }
            break
        }
        case 'ExportDefaultDeclaration': {
            ctx.default = node.declaration
            break
        }
        case 'ExportAllDeclaration': {
            // TODO: e.g., export * from "mod";
            break
        }
        default:
            break
        }
    })

    return ctx
}

module.exports = {
    filterExport
}
