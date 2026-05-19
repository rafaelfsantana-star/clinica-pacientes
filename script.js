/**
 * Aplicação principal de cadastro de pacientes
 * Gerencia o formulário, validações e interação com Supabase
 */

// ============================================
// AGUARDA O CARREGAMENTO COMPLETO DA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // ELEMENTOS DO DOM
    // ============================================
    const form = document.getElementById('patientForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    const globalMessage = document.getElementById('globalMessage');
    
    // Elementos para exibir mensagens de erro específicas
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');

    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    
    /**
     * Exibe uma mensagem global na tela
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da mensagem: 'success' ou 'error'
     */
    function showMessage(message, type) {
        globalMessage.textContent = message;
        globalMessage.className = `global-message ${type}`;
        
        // Esconde a mensagem automaticamente após 5 segundos
        setTimeout(() => {
            globalMessage.style.display = 'none';
            globalMessage.className = 'global-message';
        }, 5000);
    }
    
    /**
     * Remove todas as mensagens de erro do formulário
     */
    function clearErrors() {
        nameError.textContent = '';
        phoneError.textContent = '';
        emailError.textContent = '';
        
        nameInput.classList.remove('error');
        phoneInput.classList.remove('error');
        emailInput.classList.remove('error');
    }
    
    /**
     * Habilita ou desabilita o botão de submit
     * @param {boolean} isLoading - Indica se está carregando
     */
    function setLoading(isLoading) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
    
    /**
     * Valida o campo de nome
     * @returns {boolean} - Retorna true se válido
     */
    function validateName() {
        const name = nameInput.value.trim();
        
        if (!name) {
            nameError.textContent = 'O nome é obrigatório';
            nameInput.classList.add('error');
            return false;
        }
        
        if (name.length < 3) {
            nameError.textContent = 'Nome deve ter pelo menos 3 caracteres';
            nameInput.classList.add('error');
            return false;
        }
        
        nameError.textContent = '';
        nameInput.classList.remove('error');
        return true;
    }
    
    /**
     * Valida o campo de celular
     * @returns {boolean} - Retorna true se válido
     */
    function validatePhone() {
        let phone = phoneInput.value.trim();
        
        // Remove todos os caracteres não numéricos para validação
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (!cleanPhone) {
            phoneError.textContent = 'O celular é obrigatório';
            phoneInput.classList.add('error');
            return false;
        }
        
        // Valida tamanho mínimo (10 dígitos para celular brasileiro)
        if (cleanPhone.length < 10) {
            phoneError.textContent = 'Celular deve ter pelo menos 10 dígitos';
            phoneInput.classList.add('error');
            return false;
        }
        
        // Valida tamanho máximo (11 dígitos para celular brasileiro)
        if (cleanPhone.length > 11) {
            phoneError.textContent = 'Celular deve ter no máximo 11 dígitos';
            phoneInput.classList.add('error');
            return false;
        }
        
        phoneError.textContent = '';
        phoneInput.classList.remove('error');
        return true;
    }
    
    /**
     * Valida o campo de email
     * @returns {boolean} - Retorna true se válido
     */
    function validateEmail() {
        const email = emailInput.value.trim();
        
        if (!email) {
            emailError.textContent = 'O e-mail é obrigatório';
            emailInput.classList.add('error');
            return false;
        }
        
        // Regex para validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Digite um e-mail válido (exemplo@dominio.com)';
            emailInput.classList.add('error');
            return false;
        }
        
        emailError.textContent = '';
        emailInput.classList.remove('error');
        return true;
    }
    
    /**
     * Formata o telefone enquanto o usuário digita (melhoria de UX)
     */
    function formatPhone() {
        let phone = phoneInput.value.replace(/\D/g, '');
        
        if (phone.length <= 10) {
            // Formato: (99) 9999-9999
            phone = phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            // Formato: (99) 99999-9999
            phone = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        
        phoneInput.value = phone;
    }
    
    /**
     * Realiza todas as validações do formulário
     * @returns {boolean} - Retorna true se todas as validações passarem
     */
    function validateForm() {
        const isValidName = validateName();
        const isValidPhone = validatePhone();
        const isValidEmail = validateEmail();
        
        return isValidName && isValidPhone && isValidEmail;
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    // Formata o telefone enquanto digita
    phoneInput.addEventListener('input', formatPhone);
    
    // Validações em tempo real (quando o campo perde o foco)
    nameInput.addEventListener('blur', validateName);
    phoneInput.addEventListener('blur', validatePhone);
    emailInput.addEventListener('blur', validateEmail);
    
    // Validações em tempo real (enquanto digita - melhor experiência)
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim()) {
            nameError.textContent = '';
            nameInput.classList.remove('error');
        }
    });
    
    phoneInput.addEventListener('input', () => {
        if (phoneInput.value.trim()) {
            phoneError.textContent = '';
            phoneInput.classList.remove('error');
        }
    });
    
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim()) {
            emailError.textContent = '';
            emailInput.classList.remove('error');
        }
    });
    
    // ============================================
    // SUBMISSÃO DO FORMULÁRIO
    // ============================================
    
    /**
     * Manipula o envio do formulário
     * @param {Event} event - Evento de submit
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Impede o recarregamento da página
        
        // Limpa mensagens anteriores
        clearErrors();
        
        // Valida o formulário
        if (!validateForm()) {
            showMessage('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        // Prepara os dados para envio
        const patientData = {
            nome: nameInput.value.trim(),
            celular: phoneInput.value.trim(),
            email: emailInput.value.trim()
        };
        
        try {
            // Ativa o estado de loading
            setLoading(true);
            
            // Verifica se o Supabase está configurado
            if (!window.supabaseAPI) {
                throw new Error('Supabase não inicializado. Verifique as configurações.');
            }
            
            // Tenta inserir no banco de dados
            const result = await window.supabaseAPI.insertPatient(patientData);
            
            if (result.success) {
                // Sucesso no cadastro
                showMessage('✅ Paciente cadastrado com sucesso!', 'success');
                form.reset();  // Limpa o formulário
                
                // Remove a classe de erro dos inputs
                nameInput.classList.remove('error');
                phoneInput.classList.remove('error');
                emailInput.classList.remove('error');
                
                // Opcional: Log dos dados inseridos
                console.log('Paciente cadastrado:', result.data);
            } else {
                // Erro na inserção
                showMessage(`❌ Erro ao cadastrar: ${result.error}`, 'error');
                console.error('Erro detalhado:', result.error);
            }
        } catch (error) {
            // Erro inesperado
            showMessage('❌ Erro ao conectar com o servidor. Tente novamente.', 'error');
            console.error('Erro inesperado:', error);
        } finally {
            // Desativa o estado de loading
            setLoading(false);
        }
    });
    
    // ============================================
    // VERIFICAÇÃO INICIAL DA CONEXÃO
    // ============================================
    
    /**
     * Verifica se o Supabase está configurado corretamente
     */
    function checkSupabaseConfig() {
        if (!window.supabaseAPI) {
            console.warn('Supabase API não encontrada. Verifique o arquivo supabase.js');
            showMessage('⚠️ Configuração do banco de dados pendente. Contate o administrador.', 'error');
        } else {
            console.log('✅ Supabase configurado com sucesso');
        }
    }
    
    // Executa a verificação após o carregamento
    setTimeout(checkSupabaseConfig, 1000);
});
