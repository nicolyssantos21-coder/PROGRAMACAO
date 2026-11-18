<?php

use PHPUnit\Framework\TestCase;

class ApiTest extends TestCase
{
    public function testApiRetornaListaEmJson()
    {
        // Simula uma requisição para a API
        $url = 'http://localhost:8000/api.php?action=list';

        $content = file_get_contents($url);

        // Verifica se recebeu conteúdo
        $this->assertNotFalse($content);

        // Verifica se o conteúdo é um JSON válido
        $data = json_decode($content, true);

        $this->assertIsArray($data);
    }
}