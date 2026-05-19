/**
 * Arquivo de configuração e conexão com o Supabase
 * Este arquivo gerencia toda a comunicação com o banco de dados
 */

// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
// ATENÇÃO: Substitua estes valores pelos seus dados do Supabase
// Você encontra estas informações no Dashboard do Supabase:
// Project Settings -> API

const SUPABASE_URL = 'https://susiurpcrsizqlhebuyd.supabase.co';  // Substitua pela sua URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c2l1cnBjcnNpempscWhlYnV5ZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ3NTMzMDk1LCJleHAiOjIwNjMxMDkwOTV9.XzK5oU_XW3T7_B5r5eFq80f2y5Z9g8eH6xG5n2l2P9I';      // Chave anon pública

// ============================================
// INICIALIZAÇÃO DO CLIENTE SUPABASE
// ============================================

// Cria e exporta o cliente Supabase para uso em outros arquivos
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNÇÕES DE INTERAÇÃO COM O BANCO
// ============================================

/**
 * Insere um novo paciente no banco de dados
 * @param {Object} patientData - Dados do paciente { nome, celular, email }
 * @returns {Promise<Object>} - Retorna o resultado da operação
 */
async function insertPatient(patientData) {
    try {
        // Tenta inserir os dados na tabela 'pacientes'
        const { data, error } = await supabaseClient
            .from('pacientes')  // Nome da tabela no banco
            .insert([
                {
                    nome: patientData.nome,
                    celular: patientData.celular,
                    email: patientData.email,
                    created_at: new Date()  // Data de criação automática
                }
            ])
            .select();  // Retorna os dados inseridos

        // Verifica se houve erro na inserção
        if (error) {
            console.error('Erro do Supabase:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }

        // Sucesso na inserção
        return {
            success: true,
            error: null,
            data: data
        };
    } catch (error) {
        // Captura erros inesperados (ex: problemas de rede)
        console.error('Erro inesperado:', error);
        return {
            success: false,
            error: 'Erro de conexão com o servidor',
            data: null
        };
    }
}

/**
 * Busca todos os pacientes do banco (função auxiliar - opcional)
 * @returns {Promise<Object>} - Retorna lista de pacientes
 */
async function fetchAllPatients() {
    try {
        const { data, error } = await supabaseClient
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return {
            success: true,
            data: data,
            error: null
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.message
        };
    }
}

// ============================================
// EXPORTA FUNÇÕES PARA USO EXTERNO
// ============================================

// Torna as funções disponíveis globalmente
window.supabaseAPI = {
    insertPatient,
    fetchAllPatients,
    client: supabaseClient  // Opcional: expõe o cliente se necessário
};