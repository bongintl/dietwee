<?php

namespace Craft;

use Twig_Extension;
use Twig_Filter_Method;
use Twig_Function_Method;

function tag_regex( $tag ) {
    return "/<$tag.*?>.*?<\/$tag>/s";
}

function is_self_closing ( $tag ) {
    $selfClosingTags = [ 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr' ];
    return in_array( $tag, $selfClosingTags );
}

class BongTwigExtension extends \Twig_Extension
{

    public function getName()
    {
        return 'BONG Twig Extension';
    }

    public function getFilters()
    {
        return [
            'delete_tag' => new \Twig_Filter_Method( $this, 'delete_tag' ),
            'extract_tag' => new \Twig_Filter_Method( $this, 'extract_tag' ),
            'index_by' => new \Twig_Filter_Method( $this, 'index_by' ),
            'filter_by' => new \Twig_Filter_Method( $this, 'filter_by' ),
            'pluck' => new \Twig_Filter_Method( $this, 'pluck' ),
            'vimeo_id' => new \Twig_Filter_Method( $this, 'vimeo_id' )
        ];
    }
    
    public function getFunctions ()
    {
        return [
            'attrs' => new \Twig_Function_Method( $this, 'attrs' ),
            'style' => new \Twig_Function_Method( $this, 'style' ),
            'element' => new \Twig_Function_Method( $this, 'element' ),
            'bem' => new \Twig_Function_Method( $this, 'bem' ),
            'cls' => new \Twig_Function_Method( $this, 'cls' ),
            'srcset' => new \Twig_Function_Method( $this, 'srcset' ),
            'sizes' => new \Twig_Function_Method( $this, 'sizes' ),
            'img' => new \Twig_Function_Method( $this, 'img' )
        ];
    }
    
    public function italicise_lowercase( $content )
    {
        return str_replace(
            '<em></em>',
            '',
            "<em>" . preg_replace( '/(\b[A-Z]+\b)/', '</em>$0<em>', $content ) . "</em>"
        );
    }
    
    public function italicise_numbers( $content )
    {
        return preg_replace( '/(\b[0-9]+\b)/', '<em>$0</em>', $content );
    }
    
    public function delete_tag( $content, $tag )
    {
        return preg_replace( tag_regex( $tag ), '', $content );
    }
    
    public function extract_tag( $content, $tag )
    {
        preg_match_all( tag_regex( $tag ), $content, $matches );
        return $matches[ 0 ];
    }
    
    public function index_by( $arr, $key )
    {
        $res = [];
        foreach ( $arr as $item ) {
            $res[ $item[ $key ] ] = $item;
        }
        return $res;
    }
    
    public function filter_by ( $arr, $key, $value = null ) {
        $res = [];
        if ( $value != null ) {
            foreach ( $arr as $item ) {
                if ( $item[ $key ] == $value ) $res []= $item;
            }
        } else {
            foreach ( $arr as $item ) {
                if ( $item[ $key ] ) $res []= $item;
            }
        }
        return $res;
    }
    
    public function pluck ( $arr, $key ) {
        $res = [];
        foreach ( $arr as $item ) {
            $res []= $item[ $key ];
        }
        return $res;
    }
    
    public function attrs ( $dict ) {
        $attrs = [];
        foreach ( $dict as $key => $value ) {
            if ( $key == 'style' && is_array( $value ) ) $value = $this -> style( $value );
            if ( $key == 'class' && is_array( $value ) ) $value = $this -> cls( $value );
            if ( $key == 'sizes' && is_array( $value ) ) $value = $this -> sizes( $value );
            $attrs []= "$key=\"$value\"";
        }
        return TemplateHelper::getRaw( implode( ' ', $attrs ) );
    }
    
    public function style ( $dict ) {
        $style = [];
        foreach ( $dict as $key => $value ) {
            $attrs []= "$key: $value";
        }
        return TemplateHelper::getRaw( implode( '; ', $style ) );
    }
    
    public function cls ( $dict ) {
        $classes = [];
        foreach ( $dict as $key => $value ) {
            if ( $value ) $classes []= $key;
        }
        return TemplateHelper::getRaw( implode( ' ', $classes ) );
    }
    
    public function bem ( $be, $ms = [] ) {
        $classes = [ $be => true ];
        foreach ( $ms as $key => $value ) {
            $classes[ "$be--$key" ] = $value;
        }
        return $this -> cls( $classes );
    }
    
    public function transforms ( $asset ) {
        if ( $asset -> getExtension() == 'svg' ) {
            return [[
                'width' => $asset -> width,
                'height' => $asset -> height,
                'url' => $asset -> url,
            ]];
        }
        $transforms = craft() -> assetTransforms -> allTransforms;
    	$sortByWidth = function ( $transformA, $transformB ) {
            return $transformA -> width > $transformB -> width ? 1 : -1;
        };
        usort( $transforms, $sortByWidth );
        $srcs = [];
    	foreach ( $transforms as $transform ) {
    		$srcs[] = [
    		    'width' => $asset -> getWidth( $transform ),
    		    'height' => $asset -> getHeight( $transform ),
    			'url' => $asset -> getUrl( $transform )
    		];
    	}
    	return $srcs;
    }
    
    public function srcset ( $asset ) {
        $srcset = [];
        foreach ( $this -> transforms( $asset ) as $transform ) {
            $srcset []= $transform['url'] . ' ' . $transform['width'] . 'w';
        }
        return TemplateHelper::getRaw( implode( ', ', $srcset ) );
    }
    
    public function sizes ( $widths ) {
        $breakpoints = craft() -> config -> get('breakpoints', 'bongtwigextensions');
        $sizes = [];
        foreach ( $widths as $name => $size ) {
            $breakpointWidth = $breakpoints[ $name ];
            $sizes []= "( min-width: {$breakpointWidth}px ) $size";
        }
        return TemplateHelper::getRaw( implode( $sizes, ', ' ) );
    }
    
    public function element ( $tag, $attrs, $content = '' ) {
        $attrs = $this -> attrs( $attrs );
        $html = is_self_closing( $tag )
            ? "<$tag $attrs/>"
            : "<$tag $attrs>$content</$tag>";
        return TemplateHelper::getRaw( $html );
    }
    
    public function img ( $asset, $attrs = [] ) {
        $src = $asset -> getUrl( 'xlarge' );
        $attrs = array_merge([
            'src' => $src,
            'srcset' => $this -> srcset( $asset )
        ], $attrs );
        return $this -> element( 'img', $attrs );
    }
    
    public function vimeo_id ( $url ) {
        if ( preg_match( '%^https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)(?:[?]?.*)$%im', $url, $regs ) ) {
            return $regs[ 3 ];
        }
        return '';
    }
    
}